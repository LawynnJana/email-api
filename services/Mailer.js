const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.from_email = new helper.Email('no-reply@email.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);
    
    this.addContent(this.body); // belongs to Mail 
    this.addClickTracking();

  }

  formatAddresses(recipients) {
    return recipients.map(({email}) => {
      return new helper.Email(email);
    })
  }

  // this is how sendGrid works
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

}

module.exports = Mailer;