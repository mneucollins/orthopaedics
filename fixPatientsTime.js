var mongoose = require('mongoose');
var moment = require('moment');
var patientController = require('./controllers/patientController');
var physicianController = require('./controllers/physicianController');
var User = require('./models/userModel');

var config = require("./config.json");

mongoose.connect(config.databaseURL);

patientController.listPatientsToday(function (err, patients) {
	for (var i = 0; i < patients.length; i++) { // 

		var apptTime = moment(patients[i].apptTime);
		apptTime.subtract(1, "hour");
		patients[i].apptTime = apptTime;

		patients[i].save( function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Saved");
		});
	};
});
