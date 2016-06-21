var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var Schema       = mongoose.Schema;


var UsersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Schema.ObjectId,
        ref: "roles"
        // enum: "Physician Imaging FirstProvider Receptionist".split(" "),
    },
    // isAdmin: {
    //     type: Boolean,
    //     default: false
    // },
    email: {
        type: String,
        unique: true
    },
    token: String,
    securityQuestion: String,
    securityAnswer: String,
    provider: {
        type: String,
        default: 'local'
    },
    timestamp: { type: Date, default: Date.now },
    isActive: {
        type: Boolean,
        default: false
    },
    isCustomLayout: Boolean,
    layout: {
        coloredPriorTime: {
            type: Boolean,
            default: false
        },
        highlightNewPatients: {
            type: Boolean,
            default: false
        },
        columns: [{
            type: String,
            enum: [
                "age-column",
                "appt-time-column",
                "appt-type-column",
                "at-column",
                "fp-column",
                "fc-column",
                "imaging-column",
                "labs-column",
                "name-column",
                "physician-column",
                "room-number-column",
                "wait-status-column",
                "wait-total-column"
            ]
        }]
    }
});


UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UsersSchema);
