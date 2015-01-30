var messageModel = require('../models/messageModel');
var config = require("../config.json");


module.exports = {
  sendMessage: sendMessage
}

function sendMessage (msgData, callback) {
	
	var msgData = req.body;

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
			newMessage.sid = message.sid;
			newMessage.patient = msgData.patient;
			newMessage.message = msgData.message;

			callback(null, { response: 'message sent!' , sid: message.sid});
		}
	});
}