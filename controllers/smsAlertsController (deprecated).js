var _ = require('underscore');

var patientController = require('./patientController');
var physicianController = require("./physicianController");
var messageController = require("./messageController");

var config = require("../config.json");

setInterval(function () {
	var now = new Date();
	console.log("Checking WR patients");
	patientController.listPatientsTodayByState("WR", function (err, patients) {
		console.log("Done! " + patients.length + " patients found.");

		_.each(patients, function (patient, i, list) {

			if(!patient.physician) {
				console.log("Patient " + patient._id + " has no physician!");
				return;
			}

			if(patient.noPhone) {
				console.log("(" + i + ") " + patient.firstName + " has no phone number.");
				return;
			}

			var waitedMins = Math.round((now.getTime() - patient.WRTimestamp.getTime()) / (60*1000));
			console.log("(" + i + ") " + patient.firstName + " waited " + waitedMins + " minutes");
			
			if(waitedMins > 0 && waitedMins % 20 == 0) {
				console.log("(" + i + ") " + patient.firstName + " waited long enough!");
				physicianController.getNextPatientWaitTime(patient.physician.id, function (err, phyWaitTime) {
					if(err) console.log(err);
					else physicianController.isPhysicianInBreak(patient.physician.id, function (err, isBreakAppt) {
						if(err) {
							console.log(err);
							return;
						}
						console.log("(" + i + ") " + patient.firstName + " Physician's has a " + phyWaitTime + " minutes delay");
						if(isBreakAppt) console.log("(" + i + ") " + patient.firstName + " Physician's is on break!");

						phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2 ) : phyWaitTime ;
						
						console.log("(" + i + ") " + patient.firstName + " will receive a " + validarIntervalo(phyWaitTime) + " minutes delay message");

						messageController.getReminderMessagesByPatient(patient.id, function (err, messages) {
							var msgData = {
								patient: patient,
								msjType: "reminder"
							}
							console.log("(" + i + ") " + patient.firstName + " received a total of " + messages.length + " reminder updates");

							if(messages.length == 0) {
								console.log("(" + i + ") " + patient.firstName + " is getting reminder update #1!");

								msgData.message = "We would like to update you every 20 minutes in regards to " +
								"your wait time. " + patient.physician.name + " is now running approximately " + validarIntervalo(phyWaitTime) + 
								" minutes behind. Please keep in mind that this is just an estimate. Thank you for your " +
								"patience and understanding, and for choosing Emory Healthcare.";
							}
							else if(messages.length >= 5) {
								return;  // if patient received 5 or more messages, stop thr sending
							}
							else {
								console.log("(" + i + ") " + patient.firstName + " is getting a standard reminder update");
								msgData.message = patient.physician.name + " is now running approximately " + validarIntervalo(phyWaitTime) + 
								" minutes behind, we will continue to provide updates.";
							}

							if(phyWaitTime > 45) {
								console.log("(" + i + ") " + patient.firstName + " waited for more than 45 mins :(");
								msgData.message += " Please contact the front desk if you would like to leave the area temporarily.";
							}

							messageController.sendMessage(msgData, function (err, msj) {
								if (err) console.log(err);
	        					else console.log("reminder sms sent. ID: " + msj.sid);
							});
						});
					});
				});
			}
		});
	});
}, 60000);



function validarIntervalo(waitTime){
	var calculateTime = 5 * Math.round(waitTime / 5);
	calculateTime = calculateTime == 0 ? 5 : calculateTime ;
	switch (calculateTime){
		// case 0   :
		// case 5   :
		// case 10  :
		// case 15  :
		// case 20  :
		// case 25  :
		case 30  : return calculateTime;
		case 35  : return "20-35";
		case 40  : return "25-40";
		case 45  : return "30-45";
		case 50  : return "30-50";
		case 55  : return "30-55";
		case 60  : return "30-60";
		case 65  : return "45-65";
		case 70  : return "45-70";
		case 75  : return "50-75";
		case 80  : return "50-80";
		case 85  : return "50-85";
		case 90  : return "60-90";
		// case 95  :
		// case 100 : 
		// case 105 :
		// case 110 :
		// case 115 : 
		case 120 : return "90-120";
		// case 125 : 
		// case 130 :
		// case 135 :
		// case 140 :
		// case 145 : 
		case 150 : return "120-150";
		default : var bigTime = 15 * Math.round(waitTime / 15);
			return bigTime;
	}
}