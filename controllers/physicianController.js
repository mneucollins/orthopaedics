var _ = require('underscore');

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

                //WR patients are separated from EX patients
                var searchList = _.groupBy(patients, function (patient) { return patient.currentState; })
                // gets que last called back patient
                var lastEXCalled = _.max(searchList.EX, function (patient) { return patient.EXTimestamp.getTime(); });
                // final list contains all WR patient + last called back patient
                
                if(!searchList.WR) searchList.WR = [];
                searchList.WR.push(lastEXCalled);
                searchList = searchList.WR;

                if(searchList.length <= 0) callback(null, 0);

                var wrTime = _.max(searchList, function (item) {
                    return getWRTime(item);
                });

                callback(null, getWRTime(wrTime));

                // var now = new Date();
                // var longWRPatient;
                // var waitTime = 0;
                
                // for (var i = 0; i < patients.length; i++) {
                //     var pat = patients[i];
                //     var wrDate = pat.WRTimestamp;
                //     var apptDate = pat.apptTime;
                //     var exDate = pat.EXTimestamp;
                //     var patwaitTime;
                //     if(pat.currentState == "WR")
                //         if(apptDate.getTime() < wrDate.getTime())
                //             patwaitTime = now.getTime() - wrDate.getTime();
                //         else
                //             patwaitTime = now.getTime() - apptDate.getTime();
                //     else 
                //         if(apptDate.getTime() < wrDate.getTime())
                //             patwaitTime = exDate.getTime() - wrDate.getTime();
                //         else
                //             patwaitTime = exDate.getTime() - apptDate.getTime();

                //     if(patwaitTime > waitTime) {
                //         longWRPatient = pat;
                //         waitTime = patwaitTime;
                //     }
                // };

                // if(longWRPatient && now.getTime() >= longWRPatient.apptTime.getTime())  {
                //     var minWait = Math.round(waitTime / (60*1000));
                //     callback(null, minWait);
                // }
                // else 
                //     callback(null, 0);
			}
            else callback(null, 0);
    		
		});
}

 function getWRTime (patient) {

    if(patient.currentState == "NCI") return 0;

    var wrDate = new Date(patient.WRTimestamp);
    var apptDate = new Date(patient.apptTime);
    var exDate = new Date(patient.EXTimestamp);
    var nowDate = new Date();

    if(patient.currentState == "WR")
        if(apptDate.getTime() < wrDate.getTime()) // in the case patient arrived late
            return Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
        else
            return Math.round((nowDate.getTime() - apptDate.getTime()) / (60*1000));
    else 
        if(apptDate.getTime() < wrDate.getTime())
            return Math.round((exDate.getTime() - wrDate.getTime()) / (60*1000));
        else
            return Math.round((exDate.getTime() - apptDate.getTime()) / (60*1000));
}