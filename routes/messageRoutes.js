module.exports = function (router) {

    var tools = require('../tools');

    var messageController = require('../controllers/messageController');
    

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

    router.route('/messages/welcome')
    .post(function(req, res) { 
        
        var msgData = req.body;
        messageController.sendWelcomeMessage(msgData, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log(data, "New Message Sent");
            res.json(data);
        });
    });

    router.route('/messages/kiosk-confirmation')
    .post(function(req, res) { 
        
        var patient = req.body;
        messageController.sendKioskConfirmationMessage(patient, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log(data, "New Message Sent");
            res.json(data);
        });
    });

    router.route('/messages/bulk')
    .post(function(req, res) { 
        
        var patientsData = req.body;
        messageController.sendBulkMessages(patientsData, function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            console.log(data, "New Message Sent");
            res.json(data);
        });
    });

    router.route('/messages/response')
    .post(function(req, res) { 
        
        var messageData = req.body;
        messageController.sendTwimlResponse(messageData, function (err, responseFilePath) {
            if(err) {
                // tools.sendServerError(err, req, res);
                console.log(err);
            }

            // res.set('Content-Type', 'text/xml');
            res.sendFile(responseFilePath);
        });
    });
}