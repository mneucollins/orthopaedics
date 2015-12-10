
var emailController = require('./controllers/emailController');



function sendConfirmation (nPatients, theDate) {
	var body = "<p>Newly added patients: " + nPatients + "</p>" + 
				"<p>Appointment date: " + (theDate.getMonth() + 1) + "/" + theDate.getDate() + "/" + theDate.getFullYear() + "</p>";

	emailController.sendCustomMail("ezabaw@gmail.com", "Orthoworkflow Report", body);

}


sendConfirmation (32, new Date());