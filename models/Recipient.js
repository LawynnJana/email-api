const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false } // user's response, prevents multiple responses
});


module.exports = recipientSchema;