var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var auditorioModel = require('../models/auditorioModel');

module.exports = {
    sendTokenPassword:sendTokenPassword
}


var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: 'smtpout.secureserver.net',
    port: 25,
    auth: {
        user: 'no-reply@imbassolutions.com',
        pass: 'Aw3n'
    }
}));

// function sendConfirmationEmail (email, host, token) {
// 	console.log("token de verificación generado: " + token);
//     link="http://" + host + "/api/verify?vrf=" + token;

//     mailOptions={
//     	from: "TelecaribePlay <no-reply@spica.com.co>",
//         to : email,
//         subject : "TelecaribePlay: confirmación de registro",
//         html :
//                 '<div style="font-family:helevetica,arial">'+
//                 '<div style="background-color:#333">'+
//                     '<img src="http://telecaribeplay.spicatv.co/images/spica/logo-small-white.png"/>'+
//                 '</div>'+
//                 '<br>'+
//                 'Hola,'+
//                 '<p>Por favor haz click en el boton para confirmar tu direccion de correo electrónico y empieces a disfrutar de todos los contenidos que tenemos para ti:<br><br>'+

//                     '<a href="'+link+'" style="padding: 8px 12px; overflow: hidden; border-width: 0; outline: none; border-radius: 2px;box-shadow: 0 1px 4px rgba(0, 0, 0, .6);background-color: #c62828; color: #ecf0f1;text-decoration:none;font-family: helvetica"> Verifica tu correo</a>'+
//                 '</p>'+
//                 '<br><br><br>'+
//                 '<p>_______________________________________________________________________________</p>'+
//                 '<strong>NO RESPONDER - Mensaje Generado Automáticamente</strong><br>'+
//                 '<p>Importante:<br>'+
//                  'El receptor deberá verificar posibles virus informáticos que tenga el correo o cualquier anexo a él, razón por la cual TELECARIBE, no es responsable de los daños causados por cualquier virus transmitido en este correo electrónico. La información contenida en este mensaje y en los archivos electrónicos adjuntos es confidencial y reservada, conforme a lo previsto en la Constitución y en las políticas del CANAL, y está dirigida exclusivamente a su destinatario, sin la intención de que sea revelada o divulgada a otras personas. El acceso al contenido de esta comunicación por cualquier otra persona diferente al destinatario no está autorizado por TELECARIBE y está sancionado de acuerdo con las normas legales aplicables. El que ilícitamente sustraiga, oculte, extravíe, destruya, intercepte, controle o impida esta comunicación, antes de que llegue a su destinatario, estará sujeto a las sanciones penales correspondientes. Igualmente, incurrirá en sanciones penales el que, en provecho propio o ajeno o con perjuicio de otro, divulgue o emplee la información contenida en esta comunicación. En particular, las personas que reciban este mensaje están obligadas a asegurar y mantener la confidencialidad de la información contenida en el mismo y en general a cumplir con los deberes de custodia, cuidado, manejo y demás previstos en la Ley. Si por error recibe este mensaje, le solicitamos  borrarlo inmediatamente.</p></div>'
//     }
//     console.log(mailOptions);
//     smtpTransport.sendMail(mailOptions, function(error, response){
//         if(error){
//             console.log(error);
//         }
//         else{
//             console.log("Mensaje de confirmación enviado: " + response.message);
//         }
//     });
// }


function sendTokenPassword (email, host, token) {
    console.log("Verification token generated: " + token);
    link="http://" + host + "/restore/" + token;

    mailOptions={
        from: "Orthoworkflow <no-reply@imbassolutions.com>",
        to : email,
        subject : "Orthoworkflow: Password Retrieval",
        html :
                '<div style="font-family:helevetica,arial">'+
                '<div style="background-color:#5193C5">'+
                    '<img src="http://orthoworkflow.org/img/emory-logo-login.png"/>'+
                '</div>'+
                '<br>'+
                'Hello,'+
                '<p>Please follow this link to restore your password:<br><br>'+

                    '<a href="'+link+'" style="padding: 8px 12px; overflow: hidden; border-width: 0; outline: none; border-radius: 2px;box-shadow: 0 1px 4px rgba(0, 0, 0, .6);background-color: #5cb85c; color: #fff;text-decoration:none;font-family: helvetica"> Restablecer mi contraseña</a>'+
                '</p>'+
                '<br><br><br>'+
                '<p>_______________________________________________________________________________</p>'+
                '<strong>DO NOT REPLY - Message generated automatically</strong><br>'
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }
        else{
            console.log("Confirmation eMail sent: " + response.message);
        }
    });
}

