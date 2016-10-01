var _ = require('underscore');

var tools = require('../tools')
var physicianFrontDeskGroupModel = require('../models/physicianFrontDeskGroupModel');

module.exports = {
    nuevoPhysicianFrontDeskGroup: nuevoPhysicianFrontDeskGroup,
    listarPhysicianFrontDeskGroups: listarPhysicianFrontDeskGroups,
    obtenerPhysicianFrontDeskGroup: obtenerPhysicianFrontDeskGroup,
    actualizarPhysicianFrontDeskGroup: actualizarPhysicianFrontDeskGroup,
    eliminarPhysicianFrontDeskGroup: eliminarPhysicianFrontDeskGroup,
    getClinicDelay: getClinicDelay,
    getNextPatientWaitTime: getNextPatientWaitTime
}

function nuevoPhysicianFrontDeskGroup(newGroup, callback) {

    var physicianFrontDeskGroup = new physicianFrontDeskGroupModel();
    physicianFrontDeskGroup.physicians = newGroup.physicians;
    physicianFrontDeskGroup.name = newGroup.name;
    
    physicianFrontDeskGroup.save(function(err, elPhysicianFrontDeskGroup) {
        callback(err, elPhysicianFrontDeskGroup);
    });
}

function listarPhysicianFrontDeskGroups(callback) {
    physicianFrontDeskGroupModel
    .find({})
    .sort("name")
    .exec(callback);
}

function obtenerPhysicianFrontDeskGroup(id, callback) {
    physicianFrontDeskGroupModel
    .findById(id, "physicians name")
    .populate("physicians", "firstName lastName name email department npi isActive")
    .exec(function(err, users) {
        callback(err, users);
    });
}

function actualizarPhysicianFrontDeskGroup(id, newGroup, callback) {
    physicianFrontDeskGroupModel
    .findById(id)
    .exec(function(err, physicianFrontDeskGroup) {

        if(newGroup.physicians)
            physicianFrontDeskGroup.physicians = newGroup.physicians;
        if(newGroup.name)
            physicianFrontDeskGroup.name = newGroup.name;
        
        physicianFrontDeskGroup.save(function (err, data) {
            return callback(err, data);
        });
    });
}

function eliminarPhysicianFrontDeskGroup(id, callback) {
    physicianFrontDeskGroupModel.remove({
        _id: id
    }, function(err, physicianFrontDeskGroup) {
        callback(err, physicianFrontDeskGroup);
    });
}

function getClinicDelay (physicianFrontDeskGroupIdArray, callback) {
    
    var results = {};

    _.each(physicianFrontDeskGroupIdArray, function (element, index, list) {
        // console.log("guat ._.");
        getNextPatientWaitTime(element, function (err, phyWaitTime) {
            if(err) return callback(err);
            isPhysicianFrontDeskGroupInBreak(element, function (err, isBreakAppt) {
                if(err) return callback(err);

                phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2) : phyWaitTime;
                results[element] = phyWaitTime;

                    // console.log("index = " + index);
                    // console.log("results.size = " + _.size(results));
                    // console.log("results = " + JSON.stringify(results));

                if(_.size(results) >= list.length) {
                    // console.log("List.l = " + list.length);
                    // console.log("index = " + index);
                    // console.log("results.size = " + _.size(results));
                    // console.log("results = " + JSON.stringify(results));
                    callback(null, results);
                }
            });         
        });
    });
}

function getNextPatientWaitTime (physicianFrontDeskGroupId, callback) {
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
        physicianFrontDeskGroup: physicianFrontDeskGroupId,
        apptTime: {$gte: lowDate, $lt: highDate},
        isDeleted: false,
        $or: [{currentState: "WR"}, {currentState: "EX"}]
    })
	.sort({WRTimestamp: 1})
    .populate("physicianFrontDeskGroup")
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

            if(wrTimePatient.physicianFrontDeskGroup.patientsClinicDelay.length > 0)
                getAvgDelay(physicianFrontDeskGroupId, wrTime, function (err, avg) {
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
        // isPhysicianFrontDeskGroupInBreak
	});
}