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
var config = require("./config.json");

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

// require("./controllers/syncController").init(server);

require('./routes/passportRoutes')(authRouter, passport);
require("./routes/patientRoutes")(router, io);
require("./routes/physicianRoutes")(router);
require("./routes/messageRoutes")(router);
require("./routes/reportsRoutes")(router);

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
