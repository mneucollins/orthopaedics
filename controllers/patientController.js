var _ = require('underscore');
var moment = require('moment');

var tools = require('../tools');

var patientModel = require('../models/patientModel');
var messageController = require('./messageController');
var configController = require('./configController');
var physicianController = require("./physicianController");

var Fuse = require('../node_modules/fuse.js/src/fuse.min.js');

module.exports = {
    nuevoPatient: nuevoPatient,
    listarPatients: listarPatients,
    obtenerPatient: obtenerPatient,
    actualizarPatient: actualizarPatient,
    eliminarPatient: eliminarPatient,
    obtenerPatientHistory: obtenerPatientHistory,
    listPatientsToday: listPatientsToday,
    listPatientsBetweenDates : listPatientsBetweenDates,
    listPatientsbyPhysician: listPatientsbyPhysician,
    listPatientsbyPhysicianToday: listPatientsbyPhysicianToday,
    listPatientsbyPhysicianListToday: listPatientsbyPhysicianListToday,
    listPatientsbyPhysicianByStateToday: listPatientsbyPhysicianByStateToday,
    listPatientsbyPhysicianListByStateToday: listPatientsbyPhysicianListByStateToday,
    listPatientsTodayByState: listPatientsTodayByState,
    listPatientsTomorrow: listPatientsTomorrow,
    listPatientsToday: listPatientsToday,
    findPatientByNameDOB: findPatientByNameDOB,
    preRegisterPatient: preRegisterPatient,
    updateCellphone: updateCellphone,
    findPreRegisteredPatientsToday: findPreRegisteredPatientsToday
}

function nuevoPatient(newPatient, callback) {

    var patient = new patientModel();
    patient.firstName = newPatient.firstName;
    patient.lastName = newPatient.lastName;
    patient.dateBirth = newPatient.dateBirth;
    patient.cellphone = newPatient.cellphone;
    patient.medicalRecordNumber = newPatient.medicalRecordNumber;
    patient.apptTime = newPatient.apptTime;
    patient.apptType = newPatient.apptType;
    patient.apptDuration = newPatient.apptDuration;
    patient.physician = newPatient.physician;
    patient.email = newPatient.email;
    patient.adress = newPatient.adress;
    patient.customMessage = newPatient.customMessage;

    patient.WRTimestamp = newPatient.WRTimestamp;
    patient.EXTimestamp = newPatient.EXTimestamp;
    patient.DCTimestamp = newPatient.DCTimestamp;

    patient.enterTimestamp = [];
    patient.exitTimestamp = [];

    patient.currentState = newPatient.currentState; // delete after testing

    patient.save(function(err, addedPatient) {
        if (err) callback(err);
        else callback(null, addedPatient);
    });
}

function listarPatients(callback) {
    patientModel.find()
    .populate("physician")
    .exec(function(err, patients) {
        if (err) callback(err);
        else callback(null, patients);
    });
}

function listPatientsToday(callback) {

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({apptTime: {$gte: lowDate, $lt: highDate}})
        .populate("physician")
        .exec(function(err, patients) {
            if (err) callback(err);
            else callback(null, patients);
    });
}

function listPatientsBetweenDates(lowDate,highDate,callback) {

    lowDate = new Date(lowDate);
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    if(!highDate){
        highDate = lowDate;
    }
    else
        highDate = new Date(highDate);

    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({apptTime: {$gte: lowDate, $lt: highDate}, isDeleted: false})
        .populate("physician")
        .exec(function(err, patients) {
            if (err) callback(err);
            else callback(null, patients);
    });
}

function listPatientsTodayByState(state, callback) {

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({
        apptTime: {$gte: lowDate, $lt: highDate}, 
        currentState: state, 
        isDeleted: false})
        .populate("physician")
        .exec(function(err, patients) {
            if (err) callback(err);
            else callback(null, patients);
    });
}

function obtenerPatient(id, callback) {
  patientModel.findById(id, function(err, patients) {
    if (err) callback(err);
    else callback(null, patients);
  });
}

function actualizarPatient(id, updPatient, callback) {

    if(updPatient.currentState == "EX") {
        // var physicianController = require("./physicianController");
        patientModel.findById(id, function (err, dbPatient) {
            if (err) callback(err);
            else listPatientsbyPhysicianByStateToday(dbPatient.physician, "WR", function (err, phyPatients) {
                if (err) callback(err);
                else physicianController.getAvgDelay(dbPatient.physician, tools.getWRTime(dbPatient), function (err, avgDelay) {
                    if (err) {
                        callback(err);
                        return;
                    } 

                    updPatient.clinicDelay = avgDelay;
                    var priorApptPatient = _.find(phyPatients, function (pat) {
                        return pat.WRTimestamp.getTime() < dbPatient.WRTimestamp.getTime();
                    });

                    if(priorApptPatient) {
                        physicianController.addPatientToAvgDelay(dbPatient.physician, dbPatient, function (err) {
                            if (err) callback(err);
                            else updatePatient (updPatient, true);
                        });
                    }
                    else {
                        physicianController.clearAvgDelay(dbPatient.physician, function (err) {
                            if (err) callback(err);
                            else updatePatient (updPatient, true);
                        });
                    }
                });
            });
        });
    }
    else if(updPatient.currentState == "WR") {
        var sysConfig = configController.obtenerConfigSync();
        setTimeout(function () {
            updatePatient ({callbackEnabled: true}, false);
        }, sysConfig.callbackInterval * 60 * 1000);

        updatePatient (updPatient, true);
    } else if(updPatient.currentState == "NCI"){
        patientModel.findById(id, function (err, dbPatient) {
            dbPatient.currentState = updPatient.currentState;
            // console.log("*****************"+JSON.stringify(dbPatient));
            messageController.sendKioskCallMessage(dbPatient, function (err, data) {

                if(err) callback(err);
                else updatePatient(dbPatient, true);
                
            });
        });

        
        // messageController.sendKioskCallMessage(updPatient, function (err, data) {

        //     if(err) callback(err);
        //     else updatePatient(updPatient, true);
            
        // });
    }
    else 
        updatePatient (updPatient, true);

    function updatePatient (patientObj, doCallback) {

        console.log(JSON.stringify(patientObj));

        if(patientObj.constructor && 
            patientObj.constructor.name =="patients") {
            console.log("constructor name ok");
            patientObj.save(function (err, patient) {
                console.log(JSON.stringify(patient).pretty());
                if (doCallback) callback(err, patient);
            });
        }
        else
            patientModel.findByIdAndUpdate(id, patientObj, {new: true}, function (err, patient) {
                console.log(JSON.stringify(patient));
                if (doCallback) callback(err, patient);
            });
    }
}

function eliminarPatient(id, callback) {
  patientModel.remove({
    _id: id
  }, function(err, patient) {
    if (err) callback(err);
    else callback(null, patient);
  });
}

function obtenerPatientHistory (id, callback) {
    patientModel.findById(id, function(err, patient) {
        if (err) callback(err);
        else {
            patientModel.find({
                medicalRecordNumber: patient.medicalRecordNumber,
                _id: {$ne: id}
            })
            .limit(3)
            .exec( function (err, appts) {
                if(err) callback(err);
                else if(appts.length > 0)
                    return callback(null, appts);
                else
                    return callback(null, []);
            });
        } 
    });
}

function listPatientsbyPhysician(physicianId, callback) {
  patientModel.find({physician: physicianId})
  .populate("physician")
  .exec(function(err, patients) {
    if (err) callback(err);
    else callback(null, patients);
  });
}

function listPatientsbyPhysicianToday(physicianId, callback) {

    var lowDate = moment();
    lowDate.hours(0);
    lowDate.minutes(0);
    lowDate.seconds(0);
    lowDate.subtract(1, 'seconds');
    lowDate = lowDate.toDate();

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    console.log(lowDate.toDateString());
    console.log(highDate.toDateString());

    patientModel.find({physician: physicianId, apptTime: {$gte: lowDate, $lt: highDate}})
    .populate("physician")
    .exec(function(err, patients) {
        if (err) callback(err);
        else callback(null, patients);
    });
}

function listPatientsbyPhysicianListToday(physicians, callback) {

    var lowDate = moment();
    lowDate.hours(0);
    lowDate.minutes(0);
    lowDate.seconds(0);
    lowDate.subtract(1, 'seconds');
    lowDate = lowDate.toDate();

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    console.log(lowDate.toDateString());
    console.log(highDate.toDateString());

    patientModel.find({
        physician: {$in: physicians}, 
        apptTime: {$gte: lowDate, $lt: highDate}
    })
    .populate("physician")
    .exec(function(err, patients) {
        if (err) callback(err);
        else callback(null, patients);
    });
}

function listPatientsbyPhysicianByStateToday(physicianId, state, callback) {

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({
        physician: physicianId, 
        currentState: state,
        apptTime: {$gte: lowDate, $lt: highDate}
    })
    .populate("physician")
    .exec(function(err, patients) {
        if (err) callback(err);
        else callback(null, patients);
    });
}

function listPatientsbyPhysicianListByStateToday(physicianIdList, state, callback) {

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({
        physician: {$in: physicianIdList}, 
        currentState: state,
        apptTime: {$gte: lowDate, $lt: highDate}
    })
    .populate("physician")
    .exec(function(err, patients) {
        if (err) callback(err);
        else callback(null, patients);
    });
}

function listPatientsTomorrow(callback) {

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);
    lowDate.setDate(lowDate.getDate()+1);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+2);

    patientModel.find({apptTime: {$gte: lowDate, $lt: highDate}})
        .populate("physician")
        .exec(function(err, patients) {
            if (err) callback(err);
            else callback(null, patients);
    });
}

function preRegisterPatient(patient, callback) {

    patientModel.findById(patient._id, function (err, dbPatient) {
        if(err) return callback(err);

        dbPatient.currentState = "PR";
        dbPatient.PRTimestamp = new Date();

        dbPatient.save(function (err, savedPatient) {
            if(patient.cellphone) {
                savedPatient.cellphone = patient.cellphone;
                messageController.sendKioskConfirmationMessage(savedPatient, function (err, data) {
                    return callback(err, savedPatient);
                });
            }
            else
                return callback(err, patient);
        });
    });
}

function updateCellphone(id, number, callback){
    patientModel.findByIdAndUpdate(id, { 
        cellphone : number
    }, {new: true}, function (err, patient) {
        callback(err, patient);
    });
}

function findPatientByNameDOB(patient, callback){
    
    if(!patient.patient)
        return callback(null, []);

    var optionsLastName = {
        caseSensitive: false,
        keys: ['lastName'],   // keys to search in
        threshold: 0.2
        //id: 'name'                     // return a list of identifiers only
    }

    var optionsFirstName = {
        caseSensitive: false,
        keys: ['firstName'],   // keys to search in
        threshold: 0.2
        //id: 'name'                     // return a list of identifiers only
    }

    listPatientsToday(function (err, patients){
        if(err || !patient.patient.dateBirth) callback(err);
        else {
            var patientsMatch = [];
            var DOB = new Date(patient.patient.dateBirth);

            if(patients.length==0) callback(null,patientsMatch);
            else {
                patientsMatch = _.filter(patients, function(pat){
                    
                    return pat.dateBirth.getFullYear() == DOB.getFullYear()
                        && pat.dateBirth.getMonth() == DOB.getMonth()
                        && pat.dateBirth.getDate() == DOB.getDate();
                });

                var lastNameMatch = new Fuse(patientsMatch, optionsLastName);

                patientsMatch = lastNameMatch.search(patient.patient.lastName);

                var firstNameMatch = new Fuse(patientsMatch, optionsFirstName);

                patientsMatch = firstNameMatch.search(patient.patient.firstName);


                callback(null,patientsMatch);
            }
        }
    });

}

function findPreRegisteredPatientsToday(callback){

    listPatientsTodayByState("PR",function (err, patients){
        if(err) callback(err);
        else {
            var patientsMatch = [];

            if(patients.length==0) callback(null,patientsMatch);
            else {
                patientsMatch = patients;
                var physicians = _.pluck(patientsMatch, 'physician');
                physicians = _.pluck(physicians, '_id');
                physicians = _.uniq(physicians);

                physicianController.getClinicDelay(physicians, function(err,data){
                    
                    _.sortBy(patientsMatch, function(pat){
                        var delay = 0;
                        for(index in data){
                            if(data[index].physician == pat.physician._id){
                                delay = data[index].delay;
                            }
                        }
                        return pat.PRTimestamp.getTime() + delay; 
                    });

                    var patIds = [];

                    for(var i in patientsMatch){
                        patIds.push(patientsMatch[i].id);
                    }

                    callback(null,patIds);
                });

                // _.sortBy(patientsMatch, 'PRTimestamp');

                // var patIds = [];

                // for(var i in patientsMatch){
                //     patIds.push(patientsMatch[i].id);
                // }

                // callback(null,patIds);
            }
        }
    });
}