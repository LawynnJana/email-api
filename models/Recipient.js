const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  respoded: { type: Boolean, default: false } // user's response, prevents multiple responses
});


module.exports = recipientSchema;