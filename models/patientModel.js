var mongoose    	= require('mongoose');
var Schema      	= mongoose.Schema;

var PatientSchema   = new Schema({
	firstName: String,
	lastName: String,
	dateBirth: Date,
	cellphone: String,
	medicalRecordNumber: String, // TODO talvez necesite un índice
	apptTime: Date,
	apptType: {
		type: String,
		enum: "RPV".split(" "),
	},
	apptDuration: Number,
	physician: {
		type: Schema.ObjectId,
		ref: "users"
	},
	currentState: {
		type: String,
		enum: "NCI WR EX DC".split(" "), // Not Checked In, Waiting Room, Exam Room, Discharged
		default: "NCI"
	},
	WRTimestamp: Date,
	EXTimestamp: Date,
	DCTimestamp: Date,
	needsImaging: {
		type: Boolean,
		default: false
	},
	imagingTimestamp: Date,
	timestamp: { type: Date, default: Date.now }
});

PatientSchema.set('toJSON', {
    virtuals: true
});

//////////////////////////////////////////////////////////////////////////////
////////////////////////////// Virtual Fields ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

PatientSchema.virtual('fullName').get(function () {
	return this.firstName + " " + this.lastName;
});

PatientSchema.virtual('apptEndTime').get(function () {
	var endDate = new Date(this.apptTime).setMinutes(this.apptTime.getMinutes() + this.apptDuration);
	return endDate;
});

module.exports = mongoose.model('patients', PatientSchema);