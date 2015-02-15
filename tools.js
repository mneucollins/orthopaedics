var _ = require("underscore");

module.exports = {
	sendServerError: sendServerError,
	sendUnauthorized: sendUnauthorized,
	isLoggedIn: isLoggedIn,
	isAdmin: isAdmin
}

function sendServerError(err, req, res) {
  console.log("Error en sendServerError");
  console.log(err);
  res.set('Content-Type', 'text/plain');
  res.sendStatus(500);
}

function sendUnauthorized(req, res) {
  console.log("Acceso no autorizado al API");
  res.set('Content-Type', 'text/plain');
  res.sendStatus(401);
}

function isLoggedIn (req, res, next) {

	if (req.isAuthenticated()) {
		if(next) next();
		return true;
	}
	else {
		res.sendStatus(401);
		return false;
	}
}

function isAdmin (req, res, next) {

	if (req.isAuthenticated()) {
		if(_.contains(req.user.roles, "admin")) {
			if(next) next();
			return true;
		}
		else {
			res.sendStatus(401);
			return false;
		}
	}
	else {
		res.sendStatus(401);
		return false;
	}
}