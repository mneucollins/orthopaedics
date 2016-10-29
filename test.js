
var mongoose     = require('mongoose');
var moment     = require('moment');
var exec = require('child_process').exec;

var excelController = require('./controllers/excelController');
var messageController = require('./controllers/messageController');
var physicianController = require("./controllers/physicianController");

var config = require("./config.json");


mongoose.connect(config.databaseURL);
console.log("holaaaa");

var fechaIni = moment().subtract(4,'months').subtract(20,'days');
var fechaFin = moment().subtract(4,'months');

excelController.escribirExcel(fechaIni.toDate(), fechaFin.toDate(), function (err, filename) {
	if(err) console.log(err);

	var execCall = 'python ' + 
		config.phySummaryScriptPath + ' ' +
		config.reportsFolderPath + filename + ' ' +
		"Dr. Ananthakrishnan".replace(' ', '\\ ') + ' ' +
		config.reportsFolderPath + 'summary_' + moment().format("MM-DD-YY_HHmmss") + ".xlsm";

	console.log(execCall);
	setTimeout(function () {
		exec(execCall, function(error, stdout, stderr) {
			if (error) {
			console.error('exec error: ' + error);
			return;
			}
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
		});
	},10000);
});

// physicianController.getNextPatientWaitTime("55f98b8953e21042475ab6d1", function (err, phyWaitTime) {
		
// 	console.log("holaaaa 22");
// 		if(err) {
// 			console.log(err);
// 			return;
// 		}
// 		else {
// 			console.log("else");
// 			physicianController.isPhysicianInBreak("55f98b8953e21042475ab6d1", function (err, isBreakAppt) {
// 				if(err) {
// 					console.log(err);
// 					return;
// 				}
// 				console.log("else");

// 				var theMessage = "";
// 				// phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2 ) : phyWaitTime;
				
// 				if(isBreakAppt) console.log("Physician's is on break!");
// 				console.log(" Physician's has a " + phyWaitTime + " minutes delay");


// 			});

// 		}
// 	});

// physicianController.clearAvgDelayAll(function (err, raw) {
// 	console.log(err);
// 	console.log(raw);
// });