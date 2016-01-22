
var patientController = require('./controllers/patientController');
var emailController = require('./controllers/emailController');
var mongoose     = require('mongoose');
var config = require('./config');
var users = require('./models/userModel');

module.exports = {
	validatePatientCharge : validatePatientCharge
}

function validatePatientCharge (){


	//para usar cuándo no está ejecutándose la aplicación
	mongoose.connect(config.databaseURL);

	console.log("initiating validator");

	patientController.listPatientsTomorrow(function(err,patientList){
		console.log("listing patients");
		if(err){
			console.log("error al listar patients");
		} else {
			if(patientList.length>0){
				console.log("some patients charged");
			} else {
				emailController.sendCustomMail (config.verifierEmails, "Charging patients state", "patients not charged",
				function(wasSent){
					if(wasSent){
						console.log("mail sent");
					} else {
						console.log("mail not sent");
					}
				});
			}
		}
	});
}