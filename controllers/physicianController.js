var userModel = require('../models/userModel');

module.exports = {
  listarPhysicians: listarPhysicians,
  obtenerPhysician: obtenerPhysician,
  getNextPatientWaitTime: getNextPatientWaitTime
}

function listarPhysicians(callback) {
  userModel.find({role: "Physician"}, callback);
}

function obtenerPhysician(id, callback) {
  userModel.findById(id, function(err, users) {
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
			apptTime: {$gte: lowDate, $lt: highDate}
		})
		.exists("WRTimestamp")
		.sort({WRTimestamp: 1})
		.exec(function (err, patients) {
			if (err) callback(err);
    		else{
    			if(patients.length > 0) {
    				var patientWRTime = patients[0].WRTimestamp;
    				var waitTime = Math.round(((new Date()).getTime() - patientWRTime.getTime()) / (60*1000));
    				callback(null, waitTime);
    			}
    			else callback(null, 0);
    		} 
		});
}