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
            isDeleted: false,
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
                wrTime = getWRTime(wrTime);
                callback(null, wrTime > 0 ? wrTime : 0);

			}
            else callback(null, 0);
    		
		});
}

 function getWRTime (patient) {

    if(patient.currentState == "NCI") return 0;

    var wrDate = new Date(patient.WRTimestamp).getTime();
    var apptDate = new Date(patient.apptTime).getTime();
    var exDate = new Date(patient.EXTimestamp).getTime();
    var fcIniDate = new Date(patient.fcStartedTimestamp).getTime();
    var fcFinDate = new Date(patient.fcFinishedTimestamp).getTime();
    var nowDate = new Date().getTime();

    var isLate = apptDate < wrDate;
    var wrTime = 0;

    if(patient.currentState == "WR") {
        if(isLate) // patient arrived late
            wrTime = nowDate - wrDate;
        else // patient arrived in time
            wrTime = nowDate - apptDate;
        
        if(patient.fcDuration) { // finished FC
            if(apptDate <= fcFinDate)
                wrTime = nowDate - fcFinDate;
            else if(apptDate < fcIniDate)
                wrTime = wrTime - patient.fcDuration;
        }
        else if(patient.fcStartedTimestamp) { // in FC
            if(apptDate < nowDate)
                wrTime = 0;
            else if(apptDate < fcIniDate)
                if(isLate)
                    wrTime = fcIniDate - wrDate;
                else
                    wrTime = fcIniDate - apptDate; 
        }  
    }
    else {
        if(isLate)
            wrTime = exDate - wrDate;
        else
            wrTime = exDate - apptDate;

        if(patient.fcDuration) // finished FC
            if(apptDate <= fcFinDate)
                wrTime = exDate - fcFinDate;
            else if(apptDate < fcIniDate)
                wrTime = wrTime - patient.fcDuration;
    }
    
    return Math.round(wrTime / (60*1000));
}