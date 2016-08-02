var twilio = require('twilio');
var _ = require('underscore');

var messageModel = require('../models/messageModel');
var physicianController = require("./physicianController");
var configController = require("./configController");
var config = require("../config.json");

module.exports = {
	getReminderMessagesByPatient: getReminderMessagesByPatient,
	sendMessage: sendMessage,
	sendWelcomeMessage: sendWelcomeMessage,
	sendKioskConfirmationMessage: sendKioskConfirmationMessage,
	sendKioskCallMessage: sendKioskCallMessage,
	sendBulkMessages: sendBulkMessages,
	sendTwimlResponse: sendTwimlResponse,
	sendCustomMessage: sendCustomMessage
}

////////////////////////////////////////////////////////////
// Message updates by minute
////////////////////////////////////////////////////////////

setInterval(function () {

	var patientController = require('./patientController');
	var now = new Date();
	var sysConfig = configController.obtenerConfigSync();

	console.log("Checking WR patients");
	patientController.listPatientsTodayByState("WR", function (err, patients) {
		if(patients && patients.length>0)
			console.log("Done! " + patients.length + " patients found.");

		_.each(patients, function (patient, i, list) {
			if(!patient.physician) {
				console.log("(" + i + ") " + "Patient " + patient._id + " has no physician!");
				return;
			}
			if(patient.noPhone) {
				console.log("(" + i + ") " + patient.firstName + " has no phone number.");
				return;
			}

			var waitedMins = Math.round((now.getTime() - patient.WRTimestamp.getTime()) / (60*1000));
			console.log("(" + i + ") " + patient.firstName + " waited " + waitedMins + " minutes");
			
			if(waitedMins > 0 && waitedMins % sysConfig.msgInterval == 0) {
				console.log("(" + i + ") " + patient.firstName + " waited long enough!");
				
				getMessage("wait", patient, function (err, theMessage) {
					if(err) {
						console.log(err);
						return;
					}

					if(theMessage) { 
						var msgData = {
							patient: patient,
							msjType: "reminder",
							message: theMessage
						};

						sendMessage(msgData, function (err, msj) {
							if (err) console.log(err);
	    					else console.log("reminder sms sent. ID: " + msj.sid);
						});
					}
				});
			}
		});
	});
}, 60000);


////////////////////////////////////////////////////////////
// API 
////////////////////////////////////////////////////////////

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
			newMessage.patient = msgData.patient._id;
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
	}, function(err, msgData) {
		if(err) {
			console.log(err);
			callback(err);
		} 
		else {
			newMessage = new messageModel();
			newMessage.message = msgData.message;
			newMessage.sid = msgData.sid;
			newMessage.patient = msgData.patient._id;
			if(msgData.msjType) newMessage.msjType = msgData.msjType;

			newMessage.save(function messageSaved (err, message, numberAffected) {
				if(err) callback(err);
				else callback(null, message);
			});
		}
	});
}

function sendWelcomeMessage (msgData, callback) {

	getMessage("welcome", msgData.patient, function (err, theMessage) {
		if(err) return callback(err);

		var toNumber = msgData.patient.cellphone;
		if(!toNumber) 
			return callback("Patient has no phone number!");

		toNumber = toNumber.indexOf("+") > -1 ? toNumber : config.numberPrefix + toNumber;

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
				newMessage.patient = msgData.patient._id;
				newMessage.msjType = "welcome";

				newMessage.save(function messageSaved (err, message, numberAffected) {
					if(err) callback(err);
					else callback(null, message);
				});
			}
		});
	});	
}

function sendKioskConfirmationMessage (patient, callback) {
	getMessage("kiosk", patient, function (err, theMessage) {
		if(err) return callback(err);

		var msgData = {};
		msgData.patient = patient;
		msgData.msjType = "kiosk";
		msgData.message = theMessage;
		sendMessage(msgData, function (err, message) {
			callback(err, message);
		});
	});	
}

function sendKioskCallMessage (patient, callback) {
	getMessage("kiosk-call", patient, function (err, theMessage) {
		if(err) return callback(err);
		var msgData = {};
		msgData.patient = patient;

		msgData.msjType = "kiosk-call";
		msgData.message = theMessage;
		sendMessage(msgData, function (err, message) {
			callback(err, message);
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
				newMessage.patient = patient._id;

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
	// newMessage.patient = patient._id;

	// newMessage.save(function messageSaved (err, message, numberAffected) {
	// 	if(err) callback(err, filePath);

		var filePath = __dirname.substr(0, __dirname.lastIndexOf('/')) + "/xml/twilioDefaultResponse.xml";
		
		callback(null, filePath);
	// });
}


////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////

function getMessage(msgType, patient, callback) {
	var sysConfig = configController.obtenerConfigSync();

	console.log("Setting up new " + msgType + " message for patient " + patient.firstName + "physician: " + patient.physician.name);
	console.log(JSON.stringify(patient.physician));

	physicianController.getNextPatientWaitTime(patient.physician._id, function (err, phyWaitTime) {
		if(err) return callback(err);
		else physicianController.isPhysicianInBreak(patient.physician._id, function (err, isBreakAppt) {
			if(err) return callback(err);

			var theMessage = "";
			phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2 ) : phyWaitTime;
			
			if(isBreakAppt) console.log(patient.firstName + " Physician's is on break!");
			console.log(patient.firstName + " Physician's has a " + phyWaitTime + " minutes delay");

			if(msgType == "welcome") {
				if(phyWaitTime > 0) {
					console.log(patient.firstName + " is getting a welcome Delay message");
					theMessage = replaceTokens(sysConfig.welcomeMsgDelayText, patient, phyWaitTime);
				}
				else {
					console.log(patient.firstName + " is getting a welcome No-Delay message");
					theMessage = replaceTokens(sysConfig.welcomeMsgNoDelayText, patient, phyWaitTime);
				}
				callback(null, theMessage);
			}
			else if(msgType == "kiosk") {
				console.log(patient.firstName + " is getting a kiosk registration message");
				theMessage = replaceTokens(sysConfig.kioskMsgText, patient, phyWaitTime);

				callback(null, theMessage);
			}
			else if(msgType == "kiosk-call") {
				console.log(patient.firstName + " is getting a kiosk call message");
				theMessage = replaceTokens(sysConfig.kioskCallMsgText, patient, phyWaitTime);

				callback(null, theMessage);
			}
			else if(msgType == "wait") {
				getReminderMessagesByPatient(patient._id, function (err, messages) {
					if(err) return callback(err);
					
					console.log(patient.firstName + " received a total of " + messages.length + " reminder updates");

					if(messages.length == 0) {
						console.log(patient.firstName + " is getting reminder update #1!");
						theMessage = replaceTokens(sysConfig.firstWaitMsgText, patient, phyWaitTime);
					}
					else if(messages.length >= sysConfig.maxNumMsgs) {
						console.log(patient.firstName + " already got too many update messages");
						theMessage = false;
					}
					else {
						console.log(patient.firstName + " is getting a standard reminder update");
						theMessage = replaceTokens(sysConfig.waitMsgText, patient, phyWaitTime);
					}

					if(theMessage && phyWaitTime > sysConfig.longWaitMsgMinutes) {
						console.log(patient.firstName + " wait time is more than longWaitMsgMinutes");
						theMessage += " " + sysConfig.longWaitMsgText;
					}

					callback(null, theMessage);
				});
			}
		});
	});
}

function validarIntervalo(waitTime) {
	
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

function replaceTokens(message, patient, waitTime) {
	
	var sysConfig = configController.obtenerConfigSync();

	message = message.replace("%PAT-FIRSTNAME%", patient.firstName);
	message = message.replace("%PAT-LASTNAME%", patient.lastName);
	message = message.replace("%PHY-NAME%", patient.physician.name);
	message = message.replace("%PHY-DELAY%", validarIntervalo(waitTime));
	message = message.replace("%SYS-MSGINTERVAL%", sysConfig.msgInterval);

	return message;
}

