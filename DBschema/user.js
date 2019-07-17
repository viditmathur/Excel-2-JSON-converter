var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({

  user_name: String,

  email: {
    type: String,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean
  },
});
module.exports = mongoose.model('User', userSchema);
