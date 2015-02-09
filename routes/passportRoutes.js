// app/routes.js
module.exports = function(router, passport) {

	router.get('/logout', function(req, res) {
		req.logout();
		res.send(200);
	});

	// process the signup form
	router.post('/signup', passport.authenticate('local-signup'),
		function (req, res) {
			res.json(req.user);
		});

	router.post('/login', passport.authenticate('local-login'),
		function (req, res) {
			res.json(req.user);
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