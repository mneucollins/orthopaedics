var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PhysicianSchema = new Schema({
    firstName: String,
    lastName: String,
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: "Physician"
    },
    email: String,
    npi: {
        type: String,
        index: true,
        required: true
    },
    patientsClinicDelay: [{
        type: Schema.ObjectId,
        ref: "patients",
        default: []
    }],
    timestamp: { type: Date, default: Date.now },
    isActive: {
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('physicians', PhysicianSchema);
