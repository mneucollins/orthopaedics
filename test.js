
var mongoose     = require('mongoose');

var messageController = require('./controllers/messageController');
var physicianController = require("./controllers/physicianController");

var config = require("./config.json");


mongoose.connect(config.databaseURL);
console.log("holaaaa");

physicianController.getNextPatientWaitTime("55f98b8953e21042475ab6d1", function (err, phyWaitTime) {
		
	console.log("holaaaa 22");
		if(err) {
			console.log(err);
			return;
		}
		else {
			console.log("else");
			physicianController.isPhysicianInBreak("55f98b8953e21042475ab6d1", function (err, isBreakAppt) {
				if(err) {
					console.log(err);
					return;
				}
				console.log("else");

				var theMessage = "";
				// phyWaitTime = isBreakAppt ? Math.floor(phyWaitTime / 2 ) : phyWaitTime;
				
				if(isBreakAppt) console.log("Physician's is on break!");
				console.log(" Physician's has a " + phyWaitTime + " minutes delay");


			});

		}
	});