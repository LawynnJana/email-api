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
  app.get('/api/surveys/:id/:ans', (req,res) => {
    res.send('Thanks for voting!');
  })
  
  app.post('/api/surveys/webhooks', (req, res) => {
    console.log('test => ', req.body)
    const p = new Path('/api/surveys/:surveyId/:choice');
    const events = _.map(req.body, ({ email, url }) => {
      const match = p.test(new URL(url).pathname); //p.test return null if surveyId and choice not found
      if(match){
        return {email: email, surveyId: match.surveyId, choice: match.choice} //will return undefined for non matches
      }
    })
    const compactEvents = _.compact(events); // removed all undefined objects
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId')// remove duplicates
    console.log('Gang' ,uniqueEvents);
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