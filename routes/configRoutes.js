module.exports = function (router) {

    var tools = require('../tools');
    var configController = require('../controllers/configController');

    router.route('/config')
    .get(function(req, res) {
        configController.obtenerConfig(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Config listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var data = req.body;

        configController.actualizarConfig(data, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new config added");
            res.json(data);
        });
    });

}