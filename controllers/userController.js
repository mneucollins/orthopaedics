var crypto = require('crypto');

var userModel = require('../models/userModel');
var emailController = require('./emailController');

module.exports = {
	listarUsers: listarUsers,
    obtenerUser: obtenerUser,
    actualizarUser: actualizarUser,
    eliminarUser: eliminarUser,
	completeProfile: completeProfile,
	restorePassword: restorePassword,
	findByToken: findByToken,
	passwordRetrieval: passwordRetrieval,
	changePassword: changePassword
}

function nuevoUser(newUser, callback) {

    var user = new userModel();
    user.name = newUser.name;
    user.username = newUser.username;
    user.password = user.generateHash(newUser.posicion);
    user.role = newUser.role;
    user.email = newUser.email;
    user.isActive = newUser.isActive;

    user.save(function(err, laUser) {
        callback(err, laUser);
    });
}

function listarUsers(callback) {
    userModel.find({}, "name username role email isActive", function(err, users) {
        callback(err, users);
    });
}

function obtenerUser(id, callback) {
    userModel.findById(id, "name username role email isActive", function(err, user) {
        callback(err, user);
    });
}

function actualizarUser(id, newUser, callback) {
    if(newUser.password && newUser.password != "") {
        var dummy = new userModel();
        newUser.password = dummy.generateHash(newUser.password);
    }
    userModel.findByIdAndUpdate(id, newUser, function(err, numAffected, user) {
        callback(err, user);
    });
}

function eliminarUser(id, callback) {
    userModel.remove({
        _id: id
    }, function(err, user) {
        callback(err, user);
    });
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
    .populate("role")
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

function changePassword (userId, passwdData, callback) {
	userModel.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        // console.log(user.password);
        // console.log(user.generateHash(passwdData.oldPass));

        if (!user.validPassword(passwdData.oldPass)) {
            callback('Wrong user password');
            return;
        }
    	
        user.password = user.generateHash(passwdData.newPass);
        user.save(function (err, data) {
            callback(err, data);
        });
    });
}