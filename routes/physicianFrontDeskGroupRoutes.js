module.exports = function (router) {

    var _ = require("underscore");
    var path = require("path");
    var tools = require('../tools');
    var config = require('../config.json');

    var physicianFrontDeskGroupController = require('../controllers/physicianFrontDeskGroupController');
    var patientController = require('../controllers/patientController');

    router.route('/physicianFrontDeskGroups')
    .post(function(req, res) {
        var data = req.body;
        physicianFrontDeskGroupController.nuevoPhysicianFrontDeskGroup(data,function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physicianFrontDeskGroup added");
            res.json(data);
        });
    })
    .get(function(req, res) {
        physicianFrontDeskGroupController.listarPhysicianFrontDeskGroups(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("physicianFrontDeskGroups listed");
            res.json(data);
        });
	});

    router.route('/physicianFrontDeskGroups/:physicianFrontDeskGroupId')
    .get(function(req, res) {
        physicianFrontDeskGroupController.obtenerPhysicianFrontDeskGroup(req.params.physicianFrontDeskGroupId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("PhysicianFrontDeskGroup " + req.params.physicianFrontDeskGroupId + " listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var data = req.body;

        physicianFrontDeskGroupController.actualizarPhysicianFrontDeskGroup(req.params.physicianFrontDeskGroupId, data, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physicianFrontDeskGroup added");
            res.json(data);
        });
    })
    .delete(function(req, res) {
        physicianFrontDeskGroupController.eliminarPhysicianFrontDeskGroup(req.params.physicianFrontDeskGroupId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new physicianFrontDeskGroup added");
            res.json(data);
        });
    });

    router.route('/physicianFrontDeskGroups/metrics')
    .post(function(req, res) {
        var groupList = req.body.groupList;
        physicianFrontDeskGroupController.getGroupMetrics(groupList, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            
            res.json(data);
        });
    }); 

}