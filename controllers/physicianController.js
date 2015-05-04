var _ = require('underscore');

var tools = require('../tools');
var userModel = require('../models/userModel');
var patientModel = require('../models/patientModel');

module.exports = {
  listarPhysicians: listarPhysicians,
  obtenerPhysician: obtenerPhysician,
  getNextPatientWaitTime: getNextPatientWaitTime,
  addPatientToAvgDelay: addPatientToAvgDelay,
  clearAvgDelay: clearAvgDelay,
  getAvgDelay: getAvgDelay
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
        isDeleted: false,
        $or: [{currentState: "WR"}, {currentState: "EX"}]
	})
	.sort({WRTimestamp: 1})
    .populate("physician")
	.exec(function (err, patients) {
		if (err) callback(err);
		else if(patients.length > 0) {

            //WR patients are separated from EX patients
            var searchList = _.groupBy(patients, function (patient) { return patient.currentState; })
            // gets que last called back patient
            var lastEXCalled = _.max(searchList.EX, function (patient) { return patient.EXTimestamp.getTime(); });
            // final list contains all WR patient + last called back patient
            
            if(!searchList.WR) searchList.WR = [];
            searchList.WR.push(lastEXCalled);
            searchList = searchList.WR;

            if(searchList.length <= 0) callback(null, 0);

            var wrTimePatient = _.max(searchList, function (item) {
                return tools.getWRTime(item);
            });
            var wrTime = tools.getWRTime(wrTimePatient);
            wrTime = wrTime > 0 ? wrTime : 0;

            if(wrTimePatient.physician.patientsClinicDelay.length > 0)
                getAvgDelay(physicianId, wrTime, function (err, avg) {
                    if (err) callback(err);
                    else callback(null, avg);
                });
            else if(lastEXCalled.clinicDelay) {
                if(wrTimePatient.currentState == "WR")
                    callback(null, wrTime < lastEXCalled.clinicDelay ? lastEXCalled.clinicDelay: wrTime);
                else
                    callback(null, lastEXCalled.clinicDelay);
            }
            else {
                callback(null, wrTime);
            }
		}
        else callback(null, 0);
	});
}

 function addPatientToAvgDelay (physicianId, patient, callback) {
    userModel.findByIdAndUpdate(physicianId, {$addToSet: {patientsClinicDelay: patient._id}}
    , function (err, physician) {
        if (err) callback(err);
        else callback(null, physician);
    })
}

function clearAvgDelay (physicianId, callback) {
    userModel.findByIdAndUpdate(physicianId, {$unset: {patientsClinicDelay: ""}}
    , function (err, physician) {
        if (err) callback(err);
        else callback(null, physician);
    })
}

function getAvgDelay (physicianId, seed, callback) {
    
    if(!callback) {
        callback = seed;
        seed = null;
    }

    userModel.findById(physicianId)
    .populate("patientsClinicDelay")
    .exec(function (err, physician) {
        if (err) callback(err);
        else {
            if(physician.patientsClinicDelay.length <= 0) {
                if(seed) callback(null, seed);
                else callback(null, 0);
                return;
            }

            var sum = 0;
            for (var i = 0; i < physician.patientsClinicDelay.length; i++) {
                sum += tools.getWRTime(physician.patientsClinicDelay[i]);
            };
            var avg = 0;
            if(seed) avg = (sum + seed) / (physician.patientsClinicDelay.length + 1);
            else     avg = sum / physician.patientsClinicDelay.length;
            callback(null, Math.round(avg));
        }
    });
}