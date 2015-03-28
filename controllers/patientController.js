var patientModel = require('../models/patientModel');

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
  listPatientsTodayByState: listPatientsTodayByState
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

    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    if(!highDate){
      highDate = lowDate;
    }
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

    patientModel.find({apptTime: {$gte: lowDate, $lt: highDate}, currentState: state})
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
  patientModel.findByIdAndUpdate(id, updPatient, function (err, patient) {
    if (err) callback(err);
    else callback(null, patient);
  });
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

    var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientModel.find({physician: physicianId, apptTime: {$gte: lowDate, $lt: highDate}})
        .populate("physician")
        .exec(function(err, patients) {
            if (err) callback(err);
            else callback(null, patients);
    });
}