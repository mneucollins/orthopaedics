var patientModel = require('../models/patientModel');

module.exports = {
  nuevoPatient: nuevoPatient,
  listarPatients: listarPatients,
  obtenerPatient: obtenerPatient,
  actualizarPatient: actualizarPatient,
  eliminarPatient: eliminarPatient
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

  patient.currentState = newPatient.currentState; // delete after testing

  patient.save(function(err) {
    if (err) callback(err);
    else callback(null, { message: 'Patient added!' });
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

function obtenerPatient(id, callback) {
  patientModel.findById(id, function(err, patients) {
    if (err) callback(err);
    else callback(null, patients);
  });
}

function actualizarPatient(id, updPatient, callback) {
  patientModel.findByIdAndUpdate(id, updPatient, function (err, video) {
    if (err) callback(err);
    else callback(null, { message: 'Patient Updated!' });
  });
}

function eliminarPatient(id, callback) {
  patientModel.remove({
    _id: id
  }, function(err, patients) {
    if (err) callback(err);
    else callback(null, { message: 'Patient removed!' });
  });
}
