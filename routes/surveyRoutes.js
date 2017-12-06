const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const multer = require('multer');
const fs = require('fs');
const csv = require('fast-csv');
const xlsx = require('xlsx');

const upload = multer({dest: 'uploads/'});

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false });
    res.send(surveys);
  });

  app.get('/api/surveys/:id/:ans', (req,res) => {
    res.send('Thanks for voting!');
  });
  
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    const events = _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname); //p.test return null if surveyId and choice not found
        if(match){
          return {email: email, surveyId: match.surveyId, choice: match.choice} //will return undefined for non matches
        }
      })
      .compact() // removed all undefined objects
      .uniqBy('email', 'surveyId')// remove duplicates
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          { // this is async, but we don't need to respond to anything (SendGrid handles this)
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          }, {
            $inc:{ [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();
    res.send({});
  });


  // const sendSurvey = async (req, res, allRecipients) => {
  //   const { title, subject, body } = req;
  //   const survey = new Survey({
  //     title,
  //     subject,
  //     body,
  //     recipients: allRecipients.split(',').map(email => ({ email: email.trim() })), // map string of emails to objects
  //     _user: req.user.id, // Id of the owner of survey
  //     dateSent: Date.now()
  //   })

  //       // Send e-mail after survey creation
  //   const mailer = new Mailer(survey, surveyTemplate(survey));
  //   try {
  //     await mailer.send();
  //     await survey.save();
  //     req.user.credits -= 1;
  //     const user = await req.user.save();
  //     res.send(user);
  //   } catch (err) {
  //     res.status(422).send(err); // 422 => user sent wrong data
  //   }
  // }

  const createSurvey = (title, subject, body, recipients, req) => {
    return new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), // map string of emails to objects
      _user: req.user.id, // Id of the owner of survey
      dateSent: Date.now()
    })

  }

  app.post('/api/surveys', requireLogin, requireCredits, upload.any(), async (req, res) => {
    
    const { title, subject, body, recipients } = req.body;
    
    let invalid = true;
    let emails = '';

    if(req.files && req.files.length !== 0){
      console.log('Found uploaded file');
      // XLSX Format
      // if(req.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      //    console.log('XLSX Sheet');

      //   const workbook = xlsx.readFile(req.files[0].path);

      //   const sheet_name_list = workbook.SheetNames;
      //   //console.log(XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name_list[0]]));

      //   const output_file_name = "./uploads/temp.csv";
      //   var stream = XLSX.stream.to_csv(workbook.Sheets[sheet_name_list[0]]);
      //   stream.pipe(fs.createWriteStream(output_file_name));
      // }
      
      try {
        const stream = fs.createReadStream(req.files[0].path); 
        csv
        .fromStream(stream, {headers : true})
        .transform(data => {
          if(data['E-mail 1 - Value'] !== '' || data['E-mail 1 - Value'] !== null){
            return {'E-mail 1 - Value': data['E-mail 1 - Value'] };
          }
        })
        .on("data", function(data){
          if(emails === '') emails = data['E-mail 1 - Value']; 
          else emails = emails + ', ' + data['E-mail 1 - Value'];
        })
        .on("end", async function(){
          console.log("-----FILE Input-----");
          const allRecipients = recipients + ', ' + emails;
          
          //Create new survey
          const survey = createSurvey(title, subject, body, recipients, req);

          // Send e-mail after survey creation
          const mailer = new Mailer(survey, surveyTemplate(survey));
          try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            res.send(user);
          } catch (err) {
            res.status(422).send(err); // 422 => user sent wrong data
          }
          const user = await req.user.save();
          res.send(user);
        });
      
      } catch(err) { // Invalid data in CSV

        return res.status(422).send(err); // Make sure client side doesn't redirect 
      }
    } else {
      console.log("No files");
      const survey = createSurvey(title, subject, body, recipients, req);
      // Send e-mail after survey creation
      const mailer = new Mailer(survey, surveyTemplate(survey));
      try {
        await mailer.send();
        await survey.save();
        req.user.credits -= 1;
        const user = await req.user.save();
        res.send(user);
      } catch (err) {
        res.status(422).send(err); // 422 => user sent wrong data
      }
    }
  });

};