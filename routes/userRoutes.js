module.exports = function (router) {

    var tools = require('../tools');
    var userController = require('../controllers/userController');

    router.route('/users') 
    .post(function(req, res) {
        var data = req.body;
        userController.nuevoUser(data,function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new user added");
            res.json(data);
        });
    })
    .get(function(req, res) {
        userController.listarUsers(function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("users listed");
            res.json(data);
        });
    });

    router.route('/users/:userId')
    .get(function(req, res) {
        userController.obtenerUser(req.params.userId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            console.log("User " + req.params.userId + " listed");
            res.json(data);
        });
    })
    .put(function(req, res) {

        var data = req.body;

        userController.actualizarUser(req.params.userId, data, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new user added");
            res.json(data);
        });
    })
    .delete(function(req, res) {
        userController.eliminarUser(req.params.userId, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("new user added");
            res.json(data);
        });
    });


    router.route('/users/:userId/questions')
    .put(function(req, res) { 
        if (!tools.isLoggedIn(req, res))
            return;

        var updData = req.body;
        userController.completeProfile(req.params.userId, updData, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Profile filled for user " + user._id);
            res.json(user);
        });
    });


    router.route('/users/:userId/restorePassword')
    .put(function(req, res) { 

        var updData = req.body;
        userController.restorePassword(req.params.userId, updData, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            if(user) {
                console.log("Password reset for user " + user._id);
                res.json(user);
            }
            else res.send(403, "Invalid data"); //OK, but data is invalid
        });
    });

    router.route('/users/token/:token')
    .get(function(req, res) { 

        userController.findByToken(req.params.token, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }
            if(!user) {
                tools.sendServerError("Bad token request", req, res);
                return;
            }

            console.log("User retrieved by token " + req.params.token);
            res.json(user);
        });
    });

    router.route('/users/passwordRetrieval')
    .post(function(req, res) { 

        var updData = req.body;
        if(!updData.email) {
            res.send(401, "No email found");
            return;
        }

        userController.passwordRetrieval(updData.email, req.get('host'), function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Token sent for user " + user._id);
            res.json(user);
        });
    });

    router.route('/users/:userId/changePassword')
    .put(function(req, res) { 

        var updData = req.body;

        userController.changePassword(req.params.userId, updData, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Password changed for user " + user._id);
            res.json({par: "salian"});
        });
    });

}