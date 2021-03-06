// server.js

// BASE SETUP
// =============================================================================

var express      = require('express');
var favicon 	 = require('serve-favicon');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var morgan       = require('morgan');
var multipart 	 = require('connect-multiparty');
var passport 	 = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var socketio 	 = require('socket.io');

var config = require('./config.json');
var tools = require('./tools');

// START THE SERVER
// =============================================================================
var app = express();
var server = require('http').Server(app);

io = socketio.listen(server.listen(config.expressPort));
mongoose.connect(config.databaseURL);

// SYSTEM CONFIGURE
// =============================================================================

app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'allUrBaseAreBelongToUs' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(multipart({uploadDir: config.tmpfolder}));

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));

require('./config/passportConfig')(passport);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
var authRouter = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'API online and ready!' });
});

router.get('*', function noCache (req, res, next) {
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
});

require('./routes/passportRoutes')(authRouter, passport);

router.use(function (req, res, next) {
    if (req.url == "/messages/response" || 
        req.url == "/messages/kiosk-confirmation" || 
        req.url == "/reports/users" || 
        req.url == "/reports/physician-summary" || 
        req.url == "/patients/preregister" || 
        req.url == "/patients/updCellphone" || 
        req.url == "/patients/search")
        next();
    else if (tools.isLoggedIn(req, res))
        next();
    // else
    //     tools.sendUnauthorized(req, res);
});

require("./routes/emailRoutes")(router);
require("./routes/userRoutes")(router);
require("./routes/roleRoutes")(router, io);
require("./routes/patientRoutes")(router, io);
require("./routes/physicianRoutes")(router);
require("./routes/physicianFrontDeskGroupRoutes")(router);
require("./routes/messageRoutes")(router);
require("./routes/reportsRoutes")(router);
require("./routes/configRoutes")(router);

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
app.use('/auth', authRouter);

// app.use(function(req, res) { // manda al frontend todas las rutas no gestionadas por el backend
//   res.sendFile(__dirname + '/public/index.html');
// });
app.use(function(req, res) { // manda al frontend todas las rutas no gestionadas por el backend
  res.sendfile(__dirname + '/public/index.html');
});


// START THE SERVER
// =============================================================================
console.log('Orthopaedics running on port ' + config.expressPort + ' :)');
