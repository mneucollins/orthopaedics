var mongoose     = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema       = mongoose.Schema;


var UsersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: "Physician"
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: "Physician Imaging FirstProvider Receptionist".split(" "),
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        default: 'local'
    },
    npi: {
        type: String,
        unique: true
    },
    patientsClinicDelay: [{
        type: Schema.ObjectId,
        ref: "patients",
        default: []
    }],
    timestamp: { type: Date, default: Date.now }
});


UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UsersSchema);
