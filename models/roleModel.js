var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoleSchema = new Schema({ 
    name: String,
    adminUsers: {
        type: Boolean,
        default: false
    },
    adminPhysicians: {
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
    isLabs: {
        type: Boolean,
        default: false
    },
    isFrontdesk: {
        type: Boolean,
        default: false
    },
    isFrontdeskAdmin: {
        type: Boolean,
        default: false
    },
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
                "action-column",
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
    },
    timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model('roles', RoleSchema);
