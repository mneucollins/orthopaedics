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


    router.route('/users/restorePassword')
    .put(function(req, res) { 
        if (!tools.isLoggedIn(req, res))
            return;

        var updData = req.body;
        userController.restorePassword(updData, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Token sent for user " + user._id);
            res.json(user);
        });
    });

    router.route('/users/token/:token')
    .get(function(req, res) { 
        if (!tools.isLoggedIn(req, res))
            return;

        var updData = req.body;
        userController.findByToken(updData, function (err, user) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log("Profile filled for user " + user._id);
            res.json(user);
        });
    });

    // router.route('/users/:userId/restore')
    // .put(function(req, res) { 
    //     if (!tools.isLoggedIn(req, res))
    //         return;

    //     var updData = req.body;
    //     userController.restorePassword(updData, function (err, user) {
    //         if(err) {
    //             tools.sendServerError(err, req, res);
    //             return;
    //         }

    //         console.log("Profile filled for user " + user._id);
    //         res.json(user);
    //     });
    // });

}