const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {

  app.post('/api/surveys', requireLogin, requireCredits, (req, res) => {
    const { title, subject, body, recipients } = req.body;
    

    // Create new survey
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), // object of recipient emails
      _user: req.user.id, // Id of the owner of survey
      dateSent: Date.now()
    })

    // Send e-mail after survey creation
    const mailer = new Mailer(survey, surveyTemplate(survey));

  });

};