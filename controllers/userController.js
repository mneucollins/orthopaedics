var crypto = require('crypto');

var userModel = require('../models/userModel');
var emailController = require('./emailController');

module.exports = {
	completeProfile: completeProfile,
	restorePassword: restorePassword,
	findByToken: findByToken,
	passwordRetrieval: passwordRetrieval
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

		if(user.securityAnswer != profileData.securityAnswer) {
			callback();
			return;
		}

		user.password = user.generateHash(profileData.password);
		user.token = "";
		
		user.save(function (err, updUser) {
			if(err) callback(err);
			else callback(null, updUser);
		});
	});
}

function findByToken (token, callback) {
	userModel.findOne({token: token})
	.select("securityQuestion")
	.exec(function (err, user) {
		if(err) callback(err);
		else callback(null, user);
	});
}

function passwordRetrieval (email, host, callback) {
	userModel.findOne({ 'email' :  email }, function(err, user) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        if (!user) {
            callback('This email doesn\'t exist in our database.');
            return;
        }

        if(user) {

            var token = crypto.randomBytes(20).toString('hex');
            user.token = token;

            user.save(function(err) { // se actualiza la información de FB
                if (err) return callback(err);

                emailController.sendTokenPassword(email, host, token);
                callback(null, user);
            });
        }
    });
}