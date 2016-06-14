var mongoose    	= require('mongoose');
var Schema      	= mongoose.Schema;

var PatientSchema = new Schema({
	firstName: String,
	lastName: String,
	dateBirth: Date,
	cellphone: String,
	noPhone: Boolean,
	email: String,
	adress: String,
	medicalRecordNumber: {
		type: String, 
		index: true
	},
	apptTime: Date,
	apptType: String,
	apptDuration: Number,
	roomNumber: String,
	notes: String,
	physician: {
		type: Schema.ObjectId,
		ref: "physicians"
	},
	currentState: {
		type: String,
		enum: "NCI WR EX DC".split(" "), // Not Checked In, Waiting Room, Exam Room, Discharged
		default: "NCI"
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	callbackEnabled: {
		type: Boolean,
		default: false
	},
	deletedTimestamp: Date,
	needsImaging: {
		type: Boolean,
		default: false
	},
	WRTimestamp: Date,
	EXTimestamp: Date,
	DCTimestamp: Date,
	clinicDelay: Number,
	imagingRequestedTimestamp: Date,
	imagingStartedTimestamp: Date,
	imagingTimestamp: Date,
	fcStartedTimestamp: Date,
	fcFinishedTimestamp: Date,
	enterTimestamp: [Date],
	exitTimestamp: [Date],
	timestamp: { type: Date, default: Date.now }
});

PatientSchema.set('toJSON', {
    virtuals: true
});

PatientSchema.set('toObject', {
    virtuals: true
});

var patientModel = mongoose.model('patients', PatientSchema);

//////////////////////////////////////////////////////////////////////////////
////////////////////////////// Virtual Fields ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

PatientSchema.virtual('fullName').get(function () {
	return (this.lastName ? this.lastName : "") + ", " + (this.firstName ? this.firstName : "");
});

PatientSchema.virtual('apptEndTime').get(function () {
	var aTime = new Date(this.apptTime);
	var endDate = aTime.setMinutes(aTime.getMinutes() + this.apptDuration);
	return endDate;
});

PatientSchema.virtual('age').get(function () {
	if(this.dateBirth) {
		var age = new Date().getTime() - this.dateBirth.getTime();
		return Math.round(age / (1000 * 60 * 60 * 24 * 365));
	}
	else
		return 0;
});

PatientSchema.virtual('fcDuration').get(function () {
	if(this.fcFinishedTimestamp)
		return this.fcFinishedTimestamp.getTime() - this.fcStartedTimestamp.getTime();
	else
		return null;
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////// Virtual Methods ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

PatientSchema.method('getPriorAppts', function (callback) {
	patientModel.find({medicalRecordNumber: this.medicalRecordNumber}, function (err, appts) {
		if(err) callback(err);
		else if(appts.length > 0)
			return callback(null, appts);
		else
			return callback(null, []);
	});
});

module.exports = patientModel;