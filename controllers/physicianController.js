// var _ = require('underscore');

var userModel = require('../models/userModel');
var patientModel = require('../models/patientModel');

module.exports = {
  listarPhysicians: listarPhysicians,
  obtenerPhysician: obtenerPhysician,
  getNextPatientWaitTime: getNextPatientWaitTime
}

function listarPhysicians(callback) {
  userModel
    .find({role: "Physician"}, "name department role npi")
    .sort("name")
    .exec(callback);
}

function obtenerPhysician(id, callback) {
  userModel.findById(id, "name department role npi", function(err, users) {
    if (err) callback(err);
    else callback(null, users);
  });
}

function getNextPatientWaitTime (physicianId, callback) {
	var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

	patientModel
		.find({
			physician: physicianId,
			apptTime: {$gte: lowDate, $lt: highDate},
            $or: [{currentState: "WR"}, {currentState: "EX"}]
		})
		.sort({WRTimestamp: 1})
		.exec(function (err, patients) {
			if (err) callback(err);
    		else if(patients.length > 0) {
                var now = new Date();
                var longWRPatient;
                var waitTime = 0;
                
                for (var i = 0; i < patients.length; i++) {
                    var pat = patients[i];
                    var patwaitTime;
                    if(pat.currentState == "WR")
                        patwaitTime = now.getTime() - pat.WRTimestamp.getTime();
                    else
                        patwaitTime = pat.EXTimestamp.getTime() - pat.WRTimestamp.getTime();
                    
                    if(patwaitTime > waitTime) {
                        longWRPatient = pat;
                        waitTime = patwaitTime;
                    }
                };

                if(now.getTime() >= longWRPatient.apptTime.getTime())  {
                    var minWait = Math.round(waitTime / (60*1000));
                    callback(null, minWait);
                }
                else 
                    callback(null, 0);
			}
            else callback(null, 0);
    		
		});
}