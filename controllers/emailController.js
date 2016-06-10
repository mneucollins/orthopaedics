var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var config = require("../config.json");

module.exports = {
    sendHelpMail: sendHelpMail,
    sendCustomMail: sendMail,
    sendTokenPassword: sendTokenPassword
}


// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'orthoworkflow@imbassolutions.com',
//         pass: '3m0RYf33D'
//     }
// });

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'box1112.bluehost.com',
    port: 465,
    secure: true,
    // host: 'mail.imbassolutions.com',
    // port: 26,
    auth: {
        user: 'orthoworkflow@imbassolutions.com', //imbassolutions.com',
        pass: '3m0RYf33D'
    }
}));


function sendTokenPassword (email, host, token) {
    console.log("Verification token generated: " + token);
    link="http://" + host + "/restore/" + token;

    mailOptions={
        from: "Orthoworkflow <orthoworkflow@imbassolutions.com>",
        to : email,
        subject : "Orthoworkflow: Password Retrieval",
        html :
                '<div style="font-family:helevetica,arial">'+
                '<div style="padding: 8px 12px;background-color:#5193C5">'+
                    '<img src="http://orthoworkflow.org/img/emory-logo-login.png"/>'+
                '</div>'+
                '<br>'+
                'Hello,'+
                '<p>Please follow this link to restore your password:<br><br>'+

                    '<a href="'+link+'" style="padding: 8px 12px; overflow: hidden; border-width: 0; outline: none; border-radius: 2px;box-shadow: 0 1px 4px rgba(0, 0, 0, .6);background-color: #5cb85c; color: #fff;text-decoration:none;font-family: helvetica"> Restore my Password</a>'+
                '</p>'+
                '<br><br><br>'+
                '<p>_______________________________________________________________________________</p>'+
                '<strong>DO NOT REPLY - Message generated automatically</strong><br>'
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }
        else{
            console.log("Confirmation eMail sent: " + response.message);
        }
    });
}

function sendHelpMail (name, email, subject, body) {

    var htmlBody = "<p><b>Name:</b> " + name + "</p>" +
                "<p><b>email:</b> " + email + "</p>" + 
                "<br><p>" + body + "</p>";

    mailOptions = {
        to : config.adminEmail,
        subject : "Orthoworkflow - " + subject,
        html : htmlBody
    }

    sendMail(mailOptions.to, mailOptions.subject, mailOptions.html, function(success){
        if(success){
            console.log("^_^");
        }
        else{
            console.log(");");
        }
    });
}

function sendMail (to, subject, htmlBody, callback) {
    mailOptions={
        from: "Orthoworkflow <orthoworkflow@imbassolutions.com>",
        to : to,
        subject : subject,
        html : htmlBody
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            if(callback) callback(false);
        }
        else{
            console.log("Email sent: " + response.message);
            if(callback) callback(true);
        }
    });
}

