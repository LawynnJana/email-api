const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

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

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    

    // Create new survey
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), // map string of emails to objects
      _user: req.user.id, // Id of the owner of survey
      dateSent: Date.now()
    })

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
  });

};