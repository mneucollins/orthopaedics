module.exports = function (router) {

    var _ = require("underscore");
    var path = require("path");
    var tools = require('../tools');
    var config = require('../config.json');

    var physicianController = require('../controllers/physicianController');
    var patientController = require('../controllers/patientController');

    // UNCOMMENT ON PRODUCTION
    // router.use(function (req, res, next) {
    //     if (tools.isLoggedIn(req, res))
    //         next();
    //     else
    //         tools.sendUnauthorized(err, req, res);
    // });

    router.route('/physicians')
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

            console.log("Physician " + req.params.physicianId + " listed");
            res.json(data);
        });
    }); 
}