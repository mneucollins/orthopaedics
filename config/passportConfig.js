var crypto          = require('crypto');

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
	        User.findOne({$or:[{'username' :  username }, {'email' :  req.body.email }]}) 
            .populate("role")
            .exec( function(err, user) {
	            if (err)
	                return done(err);
	            
                if(user && user.email == req.body.email){
                    return done(null, false,  { message: 'email already in use' });
                } 
	            else if (user) {
	                return done(null, false,  { message: 'this username is already taken' });
	            } 
	            else {
                    var frontUser = req.body;
	                var newUser = new User();

	                newUser.username = username;
	                newUser.password = newUser.generateHash(password);
                    newUser.name = frontUser.name;
                    newUser.email = frontUser.email;
                    // newUser.department = frontUser.department;
                    // if(frontUser.npi) newUser.npi = frontUser.npi;
                    newUser.role = frontUser.isPhysician ? "Physician" : "Receptionist";
                    newUser.securityQuestion = frontUser.securityQuestion;
                    newUser.securityAnswer = frontUser.securityAnswer;
                     
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
    // LOCAL RE-PASSWORD ============================================================
    // =========================================================================

    passport.use('local-restore-login', new LocalStrategy({
        usernameField : 'email'
    }, function(req, email, done) {

        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }

                if (!user) {
                    return done(null, false,  { message: 'This email doesn\'t exist in our database.' });
                }

                if(user) {

                    var token = crypto.randomBytes(20).toString('hex');
                    user.token = token;

                    user.save(function(err) { // se actualiza la información de FB
                        if (err) return done(err);

                        emailController.sendTokenPassword(email, req.get('host'), token);
                        return done(null, user);
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

        User.findOne({ 'username' :  username } )
            .populate("role")
            .exec(function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, { message: 'User not found!' });
            if (!user.validPassword(password))
                return done(null, false, { message: 'Wrong Password!' }); 
            if (!user.isActive)
                return done(null, false, { message: 'The user is not activated!' }); 

            return done(null, user);
        });
    }));


};
