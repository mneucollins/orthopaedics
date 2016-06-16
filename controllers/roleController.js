var roleModel = require('../models/roleModel');

module.exports = {
  nuevoRole: nuevoRole,
  listarRoles: listarRoles,
  obtenerRole: obtenerRole,
  actualizarRole: actualizarRole,
  eliminarRole: eliminarRole
}

function nuevoRole(newRole, callback) {

    var role = new roleModel();
    role._id = newRole._id;
    role.adminUsers = newRole.adminUsers;
    role.adminRoles = newRole.adminRoles;
    role.adminLanguage = newRole.adminLanguage;
    role.adminGeneral = newRole.adminGeneral;
    role.generateReports = newRole.generateReports;
    role.isImaging = newRole.isImaging;
    role.isFrontdesk = newRole.isFrontdesk;
    role.layout = newRole.layout;

    role.save(function(err, laRole) {
        callback(err, laRole);
    });
}

function listarRoles(callback) {
    roleModel.find(function(err, roles) {
        callback(err, roles);
    });
}

function obtenerRole(id, callback) {
    roleModel.findById(id, function(err, role) {
        callback(err, role);
    });
}

function actualizarRole(id, newRole, callback) {
    roleModel.findByIdAndUpdate(id, newRole, function(err, numAffected, role) {
        callback(err, role);
    });
}

function eliminarRole(id, callback) {
    roleModel.remove({
        _id: id
    }, function(err, role) {
        callback(err, role);
    });
}
