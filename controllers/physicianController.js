var userModel = require('../models/userModel');

module.exports = {
  listarPhysicians: listarPhysicians,
  obtenerPhysician: obtenerPhysician,
}

function listarPhysicians(callback) {
  userModel.find({role: "Physician"}, callback);
}

function obtenerPhysician(id, callback) {
  userModel.findById(id, function(err, users) {
    if (err) callback(err);
    else callback(null, users);
  });
}
