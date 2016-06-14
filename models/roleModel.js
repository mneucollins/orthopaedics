var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoleSchema = new Schema({
    _id: String,
    adminUsers: {
        type: Boolean,
        default: false
    },
    adminRoles: {
        type: Boolean,
        default: false
    },
    adminLanguage: {
        type: Boolean,
        default: false
    },
    adminGeneral: {
        type: Boolean,
        default: false
    },
    generateReports: {
        type: Boolean,
        default: false
    },
    isImaging: {
        type: Boolean,
        default: false
    },
    isFrontdesk: {
        type: Boolean,
        default: false
    },
    layout: [{
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
    }],
    timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model('roles', RoleSchema);
