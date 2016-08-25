module.exports = function (router) {

    var _ = require("underscore");
    var path = require("path");
    var tools = require('../tools');
    var config = require('../config.json');

    var physicianController = require('../controllers/physicianController');
    var patientController = require('../controllers/patientController');

    router.route('/physicians')
    .post(function(req, res) {
        var data = req.body;
        physicianController.nuevoPhysician(data,function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physician added");
            res.json(data);
        });
    })
    .get(function(req, res) {
        physicianController.listarPhysicians(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("physicians listed");
            res.json(data);
        });
	});

    router.route('/physicians/:physicianId')
    .get(function(req, res) {
        physicianController.obtenerPhysician(req.params.physicianId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Physician " + req.params.physicianId + " listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var data = req.body;

        physicianController.actualizarPhysician(req.params.physicianId, data, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physician added");
            res.json(data);
        });
    })
    .delete(function(req, res) {
        physicianController.eliminarPhysician(req.params.physicianId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physician added");
            res.json(data);
        });
    });

    router.route('/physicians/waittime')
    .post(function(req, res) {
        var phyList = req.body.phyList;
        physicianController.getClinicDelay(phyList, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            
            res.json(data);
        });
    }); 

    router.route('/physicians/:physicianId/patients')
    .get(function(req, res) {
        patientController.listPatientsbyPhysician(req.params.physicianId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Physician's " + req.params.physicianId + " patients listed");
            res.json(data);
        });
    });

    router.route('/physicians/patients/today')
    .post(function(req, res) {
        var physicians = req.body.physicians;
        patientController.listPatientsbyPhysicianListToday(physicians, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Physician's list patients listed");
            res.json(data);
        });
    }); 

    router.route('/physicians/:physicianId/patients/today')
    .get(function(req, res) {
        patientController.listPatientsbyPhysicianToday(req.params.physicianId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Physician's " + req.params.physicianId + " patients listed");
            res.json(data);
        });
    }); 

    router.route('/physicians/:physicianId/waittime')
    .get(function(req, res) {
        physicianController.getNextPatientWaitTime(req.params.physicianId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Physician's " + req.params.physicianId + " clinic delay listed");
            res.json(data);
        });
    }); 
}