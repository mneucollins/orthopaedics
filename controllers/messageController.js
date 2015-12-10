var twilio = require('twilio');
var _ = require('underscore');

var messageModel = require('../models/messageModel');
var physicianController = require("./physicianController");
var config = require("../config.json");

module.exports = {
	getReminderMessagesByPatient: getReminderMessagesByPatient,
	sendMessage: sendMessage,
	sendWelcomeMessage: sendWelcomeMessage,
	sendBulkMessages: sendBulkMessages,
	sendTwimlResponse: sendTwimlResponse,
	sendCustomMessage: sendCustomMessage
}


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

function sendCustomMessage (toNumber, message, callback) {

	if(!toNumber) {
		callback("No phone number!");
		return;
	}
	toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

	var client = twilio(config.accountSid, config.authToken);

	client.messages.create({
		body: message,
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

			var theMessage = "Welcome " + msgData.patient.firstName + ", " + msgData.patient.physician.name +
				" is currently running approximately " + validarIntervalo(waitTime) + " minutes behind schedule. " +
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

function sendTwimlResponse (patientData, callback) {

	// newMessage = new messageModel();
	// newMessage.message = patientData.message;
	// newMessage.sid = patientData.sid;
	// newMessage.patient = patient.id;

	// newMessage.save(function messageSaved (err, message, numberAffected) {
	// 	if(err) callback(err, filePath);

		var filePath = __dirname.substr(0, __dirname.lastIndexOf('/')) + "/xml/twilioDefaultResponse.xml";
		
		callback(null, filePath);
	// });
}

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