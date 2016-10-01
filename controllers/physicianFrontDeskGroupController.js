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

function getGroupMetrics (physicianFrontDeskGroupIdArray, callback) {
    
    var results = {};
    // console.log("entra a getGroupMetrics");
    listarPhysicianFrontDeskGroupsByIdList(physicianFrontDeskGroupIdArray, function (err, physicianGroupList) {
        if(err) return callback(err);
        var phyGroupCounter = 0;
        // console.log("objetos consultados! comenzando recorrer");
        if(physicianGroupList.length == 0 ) 
            return callback(null, results);

        _.each(physicianGroupList, function (phyGroup, i, lst) {

            results[phyGroup._id] = {
                sumMinutes: 0,
                numPatients: 0,
                threshold: -500
            };

            physicianController
            .getClinicDelay(phyGroup.physicians, function (err, clinicDelays) {
                if(err) return callback(err);
                // console.log("clinic delay listado para grupo " + phyGroupCounter);
                // console.log("phyGroup.physicians " + JSON.stringify(phyGroup.physicians));

                patientController
                .listPatientsbyPhysicianListByStateToday(phyGroup.physicians, 'PR', 
                function (err, patients) {
                    if(err) return callback(err);

                    // console.log("Patients listados para grupo " + phyGroupCounter + " total patients: " + patients.length);
                    _.each(patients, function (pat, i, lst) {
                        // console.log("i: " + i);
                        var prTime = tools.getPRTime(pat);
                        var appt = moment(pat.apptTime);
                        var clinicDelay = clinicDelays[pat.physician._id];
                        // var prTimestamp = moment(pat.PRTimestamp);
                        // var prDelay = (new Date().getTime() - new Date(pat.PRTimestamp).getTime()) / (60 * 1000);
                        // console.log("Init ");
                        // var threshold = prTimestamp.add(prDelay, "minutes").dif...
                        var threshold = moment().diff(appt.add(clinicDelay, "minutes"), "minutes");
                        // console.log("Calc ");

                        results[phyGroup._id].sumMinutes += prTime;
                        results[phyGroup._id].numPatients++;
                        if(threshold > results[phyGroup._id].threshold)
                            results[phyGroup._id].threshold  = threshold;


                        console.log("Patient " + i + ": " + 
                            results[phyGroup._id].sumMinutes +  "-" + 
                            results[phyGroup._id].numPatients +  "-" + 
                            results[phyGroup._id].threshold);
                    });

                    phyGroupCounter++;
                    console.log("counter: " + phyGroupCounter);
                    if(phyGroupCounter >= physicianGroupList.length) {
                        console.log("calling back!!");
                        return callback(null, results);
                    }

                });
            });
        });
    });
}
