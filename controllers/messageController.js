var messageModel = require('../models/messageModel');
var config = require("../config.json");
var twilio = require('twilio');


module.exports = {
  sendMessage: sendMessage,
  sendWelcomeMessage: sendWelcomeMessage
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

			newMessage.save(function messageSaved (err, message, numberAffected) {
				if(err) callback(err);
				else callback(null, message);
			});
		}
	});
}

function sendWelcomeMessage (msgData, callback) {

	require("./physicianController")
	.getNextPatientWaitTime(msgData.patient.physician.id, function (waitTime) {
		
		var toNumber = msgData.patient.cellphone;
		toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

		var theMessage = "Welcome " + msgData.patient.fullName + 
					", your estimated wait time is " + (waitTime + 5) + " minutes";

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

				newMessage.save(function messageSaved (err, message, numberAffected) {
					if(err) callback(err);
					else callback(null, message);
				});
			}
		});
	});	
}