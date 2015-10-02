module.exports = function (router) {

    var tools = require('../tools');

    var emailController = require('../controllers/emailController');

    // router.route('/emails')
    // .post(function(req, res) { 

    //     var msgData = req.body;
    //     emailController.sendMessage(msgData, function (err, data) {
    //         if(err) {
    //             tools.sendServerError(err, req, res);
    //             return;
    //         }

    //         console.log(data, "New email Sent");
    //         res.json(data);
    //     });
    // });

    router.route('/emails/help') 
    .post(function(req, res) { 
        
        var mailData = req.body;
        emailController.sendHelpMail(mailData.name, mailData.email, mailData.subject, mailData.mailBody);
        //     function (err, data) {
        //     if(err) {
        //         tools.sendServerError(err, req, res);
        //         return;
        //     }

        // });
            // console.log(data, "New help email Sent");
        res.json({response: "email sent"});
    });
}