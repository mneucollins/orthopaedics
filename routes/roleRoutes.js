module.exports = function (router) {

    var tools = require('../tools');
    var roleController = require('../controllers/roleController');

    router.route('/roles')
    .post(function(req, res) {
        var data = req.body;
        roleController.nuevoRole(data,function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new role added");
            res.json(data);
        });
    })
    .get(function(req, res) {
        roleController.listarRoles(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("roles listed");
            res.json(data);
        });
    });

    router.route('/roles/:roleId')
    .get(function(req, res) {
        roleController.obtenerRole(req.params.roleId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Role " + req.params.roleId + " listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var data = req.body;

        roleController.actualizarRole(req.params.roleId, data, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new role added");
            res.json(data);
        });
    })
    .delete(function(req, res) {
        roleController.eliminarRole(req.params.roleId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new role added");
            res.json(data);
        });
    });

}