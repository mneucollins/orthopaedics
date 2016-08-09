var _ = require('underscore');

var tools = require('../tools');
var physicianModel = require('../models/physicianModel');
var patientModel = require('../models/patientModel');

module.exports = {
    nuevoPhysician: nuevoPhysician,
    listarPhysicians: listarPhysicians,
    obtenerPhysician: obtenerPhysician,
    actualizarPhysician: actualizarPhysician,
    eliminarPhysician: eliminarPhysician,
    getClinicDelay: getClinicDelay,
    getNextPatientWaitTime: getNextPatientWaitTime,
    addPatientToAvgDelay: addPatientToAvgDelay,
    clearAvgDelayAll: clearAvgDelayAll,
    clearAvgDelay: clearAvgDelay,
    getAvgDelay: getAvgDelay,
    isPhysicianInBreak: isPhysicianInBreak
}

function nuevoPhysician(newPhysician, callback) {

    var physician = new physicianModel();
    physician.firstName = newPhysician.firstName;
    physician.lastName = newPhysician.lastName;
    physician.name = newPhysician.name;
    physician.department = newPhysician.department;
    physician.email = newPhysician.email;
    physician.npi = newPhysician.npi;
    physician.isActive = newPhysician.isActive;
    physician.patientsClinicDelay = [];

    physician.save(function(err, elPhysician) {
        callback(err, elPhysician);
    });
}

function listarPhysicians(callback) {
    physicianModel
    .find({}, "name department npi email isActive")
    .sort("name")
    .exec(callback);
}

function obtenerPhysician(id, callback) {
    physicianModel.findById(id, "firstName lastName name email department npi isActive", 
    function(err, users) {
        callback(err, users);
    });
}

function actualizarPhysician(id, newPhysician, callback) {
    physicianModel.findByIdAndUpdate(id, newPhysician, function(err, numAffected, physician) {
        callback(err, physician);
    });
}

function eliminarPhysician(id, callback) {
    physicianModel.remove({
        _id: id
    }, function(err, physician) {
        callback(err, physician);
    });
}

function getClinicDelay (physicianIdArray, callback) {
    
    var results = {};

    _.each(physicianIdArray, function (element, index, list) {
        getNextPatientWaitTime(element, function (err, phyWaitTime) {
            if(err) callback(err);
            else isPhysicianInBreak(element, function (err, isBreakAppt) {
                if(err) callback(err);
                else {
                    phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2) : phyWaitTime;
                    results[element] = phyWaitTime;

                    if(index >= list.length-1)
                        callback(err, results);
                }
            });         
        });
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
                    callback(null, wrTime < lastEXCalled.clinicDelay ? lastEXCalled.clinicDelay : wrTime);
                else
                    callback(null, lastEXCalled.clinicDelay);
            }
            else {
                callback(null, wrTime);
            }
		}
        else callback(null, 0);
        // isPhysicianInBreak
	});
}

function addPatientToAvgDelay (physicianId, patient, callback) {
    physicianModel.findByIdAndUpdate(physicianId, {$addToSet: {patientsClinicDelay: patient._id}}, 
    function (err, physician) {
        if (err) callback(err);
        else callback(null, physician);
    })
}

function clearAvgDelay (physicianId, callback) {
    physicianModel.findByIdAndUpdate(physicianId, {$unset: {patientsClinicDelay: ""}}
    , function (err, physician) {
        if (err) callback(err);
        else callback(null, physician);
    })
}

function clearAvgDelayAll (callback) {
    physicianModel.update({}, {$unset: {patientsClinicDelay: ""}}, {multi: true}
    , function (err, rawRes) {
        callback(err, rawRes);
    });
}

function getAvgDelay (physicianId, seed, callback) {
    
    if(!callback) {
        callback = seed;
        seed = null;
    }

    physicianModel.findById(physicianId)
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
            var negativeWR = 0;
            for (var i = 0; i < physician.patientsClinicDelay.length; i++) {
                var dummyWRTime = tools.getWRTime(physician.patientsClinicDelay[i]);
                if(dummyWRTime >= 0) 
                    sum += dummyWRTime;
                else
                    negativeWR++;  // patient that are early     
            };
            var avg = 0;
            if(seed) avg = (sum + seed) / (physician.patientsClinicDelay.length - negativeWR + 1);
            else     avg = sum / (physician.patientsClinicDelay.length - negativeWR);
            callback(null, Math.round(avg));
        }
    });
}

function isPhysicianInBreak (physicianId, callback) {
    
    var nowHour = new Date().getHours();

    if(nowHour < 11 || 14 < nowHour) {
        callback(null, false);
        return;
    }

    var patientController = require("./patientController");
    patientController.listPatientsbyPhysicianToday(physicianId, function (err, patients) {
        if (err) callback(err);
        else {
            var isBreak = false;
            _.each(patients, function (element, index, list) {
                if(11 <= element.apptTime.getHours() && element.apptTime.getHours() <= 14)
                    if(index > 0)
                        isBreak |= element.apptTime.getTime() - list[index-1].apptTime.getTime() >= 60 * 60 * 1000;
                    if(index < list.length-1)
                        isBreak |= list[index+1].apptTime.getTime() - element.apptTime.getTime() >= 60 * 60 * 1000;
            });
            callback(err, isBreak); 
        }
    });
}       