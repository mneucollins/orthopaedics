module.exports = function (router) {

    var tools = require('../tools');
    var userController = require('../controllers/userController');


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

}