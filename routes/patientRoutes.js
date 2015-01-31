module.exports = function (router) {

    var _ = require("underscore");
    var path = require("path");
    var tools = require('../tools');
    var config = require('../config.json');

    var patientController = require('../controllers/patientController');

    // UNCOMMENT ON PRODUCTION
    router.use(function (req, res, next) {
        if (tools.isLoggedIn(req, res))
            next();
        else
            tools.sendUnauthorized(err, req, res);
    });

    router.route('/patients')
    .post(function(req, res) { 

        var newPatient = req.body;
        newPatient.usuario = req.user;
        patientController.nuevoPatient(newPatient, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log(data, "New Patient Added");
            res.json(data);
        });
    })
    .get(function(req, res) {
        patientController.listarPatients(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Patients listed");
            res.json(data);
        });
	});


    router.route('/patients/:patientId')
    .get(function(req, res) {
        patientController.obtenerPatient(req.params.patientId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Patient " + req.params.patientId + " listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var newPatient = req.body; 
        patientController.actualizarPatient(req.params.patientId, newPatient, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            console.log("Patient" + req.params.patientId + " Updated");
            res.json(data);
            
        });
    });
}