// app/routes.js
module.exports = function(router, passport) {

	router.get('/logout', function(req, res) {
		req.logout();
		res.send(200);
	});

	router.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup',
            function(err, user, info) {
            if (err) {
                return res.send(500, "Error de Servidor");
            }
            if (!user) {
                console.log(info)
                return res.send(401, info);
            }
            
            user.password = null;
            return res.json(req.user);

            /*req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.json(req.user);
			});*/

        })(req, res, next);
    });

	router.post('/restoreLogin', function (req, res, next) {
		passport.authenticate('local-restore-login', function (err, user, info) {
			res.json(user);
		});
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) { 
				return res.send(500, "Server error"); 
			}
			if (!user) { 
				return res.send(401, info); 
			}
			
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				req.user.password = null;
				return res.json(req.user);
			});
		})(req, res, next);
	});

	router.get('/loggedin', function(req, res) {
	  res.send(req.isAuthenticated() ? req.user : '0');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}