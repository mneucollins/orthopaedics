var userModel = require('../models/userModel');
var patientModel = require('../models/patientModel');

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
	
	patientModel
		.find({physician: physicianId})
		.sort({WRTimestamp: 1})
		.exec(function (patients) {
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