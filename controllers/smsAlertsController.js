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