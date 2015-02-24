var mongoose    	= require('mongoose');
var Schema      	= mongoose.Schema;

var PatientSchema   = new Schema({
	firstName: String,
	lastName: String,
	dateBirth: Date,
	cellphone: String,
	email: String,
	adress: String,
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
	needsImaging: {
		type: Boolean,
		default: false
	},
	WRTimestamp: Date,
	EXTimestamp: Date,
	DCTimestamp: Date,
	imagingRequestedTimestamp: Date,
	imagingTimestamp: Date,
	enterTimestamp: Date,
	exitTimestamp: Date,
	timestamp: { type: Date, default: Date.now },
	email: String,
	adress: String,
	customMessage: String,
	timestamp: { type: Date, default: Date.now }
});

PatientSchema.set('toJSON', {
    virtuals: true
});

var patientModel = mongoose.model('patients', PatientSchema);

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