var _            = require('underscore');
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
                "pre-register-column",
                "wait-status-column",
                "wait-total-column"
            ]
        }]
    }
});

UsersSchema.set('toJSON', {
    virtuals: true
});

UsersSchema.set('toObject', {
    virtuals: true
});


UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



//////////////////////////////////////////////////////////////////////////////
////////////////////////////// Virtual Fields ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

UsersSchema.virtual('isAdmin').get(function () {
    console.log("entered isAdmin field: ");

    if(_.isObject(this.role)) {
        console.log("user has role obj!");
        console.log(this.role.adminUsers
            || this.role.adminLanguage
            || this.role.adminGeneral
            || this.role.isFrontdeskAdmin
            || this.role.adminRoles);

        return this.role.adminUsers
            || this.role.adminLanguage
            || this.role.adminGeneral
            || this.role.isFrontdeskAdmin
            || this.role.adminRoles;
    }
    else {
        console.log(false);
        return false;
    }

});

/////////////

var userModel = mongoose.model('users', UsersSchema);
module.exports = userModel;

