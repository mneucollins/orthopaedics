var userModel = require('../models/userModel');

module.exports = {
	completeProfile: completeProfile,
	restorePassword: restorePassword,
	findByToken: findByToken
}

function completeProfile (id, profileData, callback) {
	userModel.findByIdAndUpdate(id, {
		email: profileData.email,
		securityQuestion: profileData.securityQuestion, 
		securityAnswer: profileData.securityAnswer 
	}, function (err, updUser) {
		if(err) callback(err);
		else callback(null, updUser);
	});
}


function restorePassword (id, profileData, callback) {
	userModel.findById(id, function (err, user) {

		user.password = user.generateHash(profileData.password);

		user.save(function (err, updUser) {
			if(err) callback(err);
			else callback(null, updUser);
		});
	});
}

function findByToken (token, callback) {
	userModel.find({token: token}, function (err, user) {
		if(err) callback(err);
		else callback(null, user);
	});
}