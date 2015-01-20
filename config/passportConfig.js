
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/userModel');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    }, function(req, username, password, done) {

        process.nextTick(function() {
	        User.findOne({ 'username' :  username }, function(err, user) {
	            if (err)
	                return done(err);
	            
	            if (user) {
	                return done(null, false,  { message: 'This username is already taken' });
	            } 
	            else {
                    var frontUser = req.body;
	                var newUser = new User();

	                newUser.username = username;
	                newUser.password = newUser.generateHash(password);
                    newUser.name = frontUser.name;

	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });    
        });
    }));

	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    }, function(req, username, password, done) { 

        User.findOne({ 'username' :  username }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, { message: 'User not found!' });
            if (!user.validPassword(password))
                return done(null, false, { message: 'Wrong Password!' }); 


            return done(null, user);
        });
    }));


};
