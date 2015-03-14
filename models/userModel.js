var mongoose     = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema       = mongoose.Schema;


var UsersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  department: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: "Physician Imaging FirstProvider Receptionist".split(" "),
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: 'local'
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date,
  // facebook: {},
  // twitter: {},
  // google: {},
  timestamp: { type: Date, default: Date.now },
  npi: {
    type: String,
    unique: true
  }
});


UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UsersSchema);
