module.exports = function (router) {

    var tools = require('../tools');

    var messageController = require('../controllers/messageController');

    router.use(function (req, res, next) {
        if (tools.isLoggedIn(req, res))
            next();
        else
            tools.sendUnauthorized(err, req, res);
    });

    router.route('/messages')
    .post(function(req, res) { 

        var msgData = req.body;
        messageController.sendMessage(msgData, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log(data, "New Message Sent");
            res.json(data);
        });
    });

}