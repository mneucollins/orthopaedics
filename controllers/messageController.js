var twilio = require('twilio');
var _ = require('underscore');

var messageModel = require('../models/messageModel');
var patientController = require('./patientController');
var physicianController = require("./physicianController");
var config = require("../config.json");

module.exports = {
	getReminderMessagesByPatient: getReminderMessagesByPatient,
	sendMessage: sendMessage,
	sendWelcomeMessage: sendWelcomeMessage,
	sendBulkMessages: sendBulkMessages
}

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

						phyWaitTime = isBreakAppt ? 5 * Math.ceil(Math.floor(phyWaitTime / 2 ) / 5) : 5 * Math.ceil(phyWaitTime  / 5);
						console.log("(" + i + ") " + patient.firstName + " will receive a " + phyWaitTime + " minutes delay message");

						getReminderMessagesByPatient(patient.id, function (err, messages) {
							var msgData = {
								patient: patient,
								msjType: "reminder"
							}
							console.log("(" + i + ") " + patient.firstName + " received a total of " + messages.length + " reminder updates");

							if(messages.length == 0) {
								console.log("(" + i + ") " + patient.firstName + " is getting reminder update #1!");

								msgData.message = "We would like to update you every 20 minutes in regards to " +
								"your wait time. " + patient.physician.name + " is now running at least " + phyWaitTime + 
								" minutes behind. Please keep in mind that this is just an estimate. Thank you for your " +
								"patience and understanding, and for choosing Emory Healthcare.";
							}
							else if(messages.length >= 5) {
								return;  // if patient received 5 or more messages, stop thr sending
							}
							else {
								console.log("(" + i + ") " + patient.firstName + " is getting a standard reminder update");
								msgData.message = patient.physician.name + " is now running at least " + phyWaitTime + 
								" minutes behind, we will continue to provide updates.";
							}

							if(phyWaitTime > 45) {
								console.log("(" + i + ") " + patient.firstName + " waited for more than 45 mins :(");
								msgData.message += " Please contact the front desk if you would like to leave the area temporarily.";
							}

							sendMessage(msgData, function (err, msj) {
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

function getReminderMessagesByPatient (patientId, callback) {
	messageModel.find({patient: patientId, msjType: "reminder"}, function (err, messages) {
		if (err) callback(err);
        else callback(null, messages);
	});
}

function sendMessage (msgData, callback) {

	var toNumber = msgData.patient.cellphone;
	if(!toNumber) {
		callback("Patient has no phone number!");
		return;
	}
	toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

	var client = twilio(config.accountSid, config.authToken);

	client.messages.create({
		body: msgData.message,
		to: toNumber,
		from: config.fromNumber,
	}, function(err, message) {
		if(err) {
			console.log(err);
			callback(err);
		} 
		else {
			newMessage = new messageModel();
			newMessage.message = msgData.message;
			newMessage.sid = message.sid;
			newMessage.patient = msgData.patient.id;
			if(msgData.msjType) newMessage.msjType = msgData.msjType;

			newMessage.save(function messageSaved (err, message, numberAffected) {
				if(err) callback(err);
				else callback(null, message);
			});
		}
	});
}

function sendWelcomeMessage (msgData, callback) {

	physicianController.getNextPatientWaitTime(msgData.patient.physician._id, function (err, waitTime) {
		
		var toNumber = msgData.patient.cellphone;
		if(!toNumber) {
			callback("Patient has no phone number!");
			return;
		}

		toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;
		var theMessage = "";

		if(waitTime > 0){
			waitTime = 5 * Math.ceil(waitTime / 5);
			var theMessage = "Welcome " + msgData.patient.firstName + ", " + msgData.patient.physician.name +
				" is currently running " + (waitTime) + " minutes behind schedule. " +
				"We will keep you informed about waits and delays as a part of a desire to be sensitive to your needs as a patient.";
			}
		else
			var theMessage = "Welcome " + msgData.patient.firstName + ", " + msgData.patient.physician.name +
				" is currently running on schedule. " +
				"We will keep you informed about waits and delays as a part of a desire to be sensitive to your needs as a patient.";

		var client = twilio(config.accountSid, config.authToken);

		client.messages.create({
			body: theMessage,
			to: toNumber,
			from: config.fromNumber,
		}, function(err, message) {
			if(err) {
				console.log(err);
				callback(err);
			} 
			else {
				newMessage = new messageModel();
				newMessage.message = theMessage;
				newMessage.sid = message.sid;
				newMessage.patient = msgData.patient.id;
				newMessage.msjType = 

				newMessage.save(function messageSaved (err, message, numberAffected) {
					if(err) callback(err);
					else callback(null, message);
				});
			}
		});
	});	
}

function sendBulkMessages (patientsData, callback) {

	var client = twilio(config.accountSid, config.authToken);

	_.each(patientsData.patient, function (patient, index, list) {
		var toNumber = patient.cellphone;
		if(!toNumber) {
			callback("Patient has no phone number!");
			return;
		}
		toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

		client.messages.create({
			body: patientsData.message,
			to: toNumber,
			from: config.fromNumber,
		}, function(err, message) {
			if(err) {
				console.log(err);
				callback(err);
			} 
			else {

				newMessage = new messageModel();
				newMessage.message = patientsData.message;
				newMessage.sid = message.sid;
				newMessage.patient = patient.id;

				newMessage.save(function messageSaved (err, message, numberAffected) {
					if(err) console.log(err);
				});
			}
		});
	});

	callback(null, true);
}