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
	console.log("Checking WR patients");
	var now = new Date();
	patientController.listPatientsTodayByState("WR", function (err, patients) {
		console.log("Done! " + patients.length + " patients found.");
		_.each(patients, function (patient, i, list) {

			var waitedMins = Math.round((now.getTime() - patient.WRTimestamp.getTime()) / (60*1000));
			console.log("(" + i + ") " + patient.fullName + " waited " + waitedMins + " minutes");
			
			if(waitedMins % 20 == 0) {
				console.log("(" + i + ") " + patient.fullName + " waited long enough!");
				physicianController.getNextPatientWaitTime(patient.physician.id, function (err, waitTime) {
					console.log("(" + i + ") " + patient.fullName + " Physician's has a " + waitTime + "minutes delay");
					getReminderMessagesByPatient(patient.id, function (err, messages) {
						var msgData = {
							patient: patient,
							msjType: "reminder"
						}
						console.log("(" + i + ") " + patient.fullName + " received a total of " + messages.length + " reminder updates");

						if(messages.length == 0) {
							console.log("(" + i + ") " + patient.fullName + " is getting reminder update #1!");

							msgData.message = "We would like to update you every 20 minutes in regards to " +
							"your wait time. We estimate that you will be called back by your doctor's staff in approximately " + 
							(waitTime + 5) + " minutes. Please keep in mind that this is just an estimate. Thank you for your " +
							"patience and understanding, and for choosing Emory Healthcare.";
						}
						else if(waitTime < 5) {
							console.log("(" + i + ") " + patient.fullName + " is getting last reminder.");
							msgData.message= "Thank you for your patience. We estimate that you will be called back by " +
							"your doctor's staff in the next few minutes.";
						}
						else {
							console.log("(" + i + ") " + patient.fullName + " is getting a standard reminder update");
							msgData.message = "Thank you for your patience. We estimate that you will be called back by " +
							"your doctor's staff in approximately " + (waitTime + 5) + " minutes.";
						}

						sendMessage(msgData, function (err, msj) {
							if (err) console.log(err);
        					else console.log("reminder sms sent. ID: " + msj.sid);
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
		toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

		var theMessage = "Welcome " + msgData.patient.firstName + 
					", your estimated wait time is " + (waitTime + 5) + 
					" mins. We will keep you informed about waits and delays as a part of a desire to be sensitive to your needs as a patient.";

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