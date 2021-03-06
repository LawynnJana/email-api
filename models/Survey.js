const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  fromEmail: String,
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: {type: Number, default: 0 },
  no: {type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User'}, //reference tot he owner user of this survey
  dateSent: Date, //gives an idea of how active survey is
  lastResponded: Date, // """""""""""""""""""""
});

mongoose.model('surveys', surveySchema);

