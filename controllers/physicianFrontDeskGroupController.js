var _ = require('underscore');
var moment = require('moment');

var tools = require('../tools')
var physicianFrontDeskGroupModel = require('../models/physicianFrontdeskGroupModel');
var physicianController = require('./physicianController');
var patientController = require('./patientController');

module.exports = {
    nuevoPhysicianFrontDeskGroup: nuevoPhysicianFrontDeskGroup,
    listarPhysicianFrontDeskGroups: listarPhysicianFrontDeskGroups,
    obtenerPhysicianFrontDeskGroup: obtenerPhysicianFrontDeskGroup,
    actualizarPhysicianFrontDeskGroup: actualizarPhysicianFrontDeskGroup,
    eliminarPhysicianFrontDeskGroup: eliminarPhysicianFrontDeskGroup,
    getPhysicianListMetrics: getPhysicianListMetrics,
    getGroupMetrics: getGroupMetrics
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

function listarPhysicianFrontDeskGroupsByIdList(idList, callback) {
    physicianFrontDeskGroupModel
    .find({_id: {$in: idList}})
    // .sort("name")
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

function getPhysicianListMetrics(physicianIdArray, callback) {
    
    var results = {
        sumMinutes: 0,
        numPatients: 0,
        threshold: -500
    };

    physicianController
    .getClinicDelay(physicianIdArray, function (err, clinicDelays) {
        if(err) return callback(err);

        patientController
        .listPatientsbyPhysicianListByStateToday(physicianIdArray, 'PR', 
        function (err, patients) {
            if(err) return callback(err);

            _.each(patients, function (pat, i, lst) {
               
                var prTime = tools.getPRTime(pat);
                var appt = moment(pat.apptTime);
                var clinicDelay = clinicDelays[pat.physician._id];
                
                var threshold = moment().diff(appt.add(clinicDelay, "minutes"), "minutes");

                results.sumMinutes += prTime;
                results.numPatients++;
                if(threshold > results.threshold)
                    results.threshold  = threshold;
            });

            return callback(null, results);
        });
    });
}

function getGroupMetrics (physicianFrontDeskGroupIdArray, callback) {
    
    var results = {};

    listarPhysicianFrontDeskGroupsByIdList(physicianFrontDeskGroupIdArray, function (err, physicianGroupList) {
        if(err) return callback(err);
        var phyGroupCounter = 0;

        if(physicianGroupList.length == 0 ) 
            return callback(null, results);

        _.each(physicianGroupList, function (phyGroup, i, lst) {

            getPhysicianListMetrics(phyGroup.physicians, function (err, result) {
                if(err) return callback(err);

                results[phyGroup._id] = result;     

                phyGroupCounter++;
                // console.log("counter: " + phyGroupCounter);
                if(phyGroupCounter >= physicianGroupList.length) {
                    console.log("calling back!!");
                    return callback(null, results);
                }
            });
        });
    });
}
