var mongoose = require('mongoose');
var patientController = require('./controllers/patientController');
var User = require('./models/userModel');

var config = require("./config.json");

mongoose.connect(config.databaseURL);

var testPhysicians = [{
	name: "Dr. Smith",
	username: "drsmith",
	password: "123456"
},{
	name: "Dr. Jones",
	username: "drjones",
	password: "123456"
},{
	name: "Dr. Premkumar",
	username: "drpremk",
	password: "123456"
}];

var testPatients = [{
	firstName: "Tom",
	lastName: "Hanks",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "234456123231",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(2015,01,15, 8, 0, 0),
	apptDuration: 15
},{
	firstName: "Eddy",
	lastName: "Murphy",
	dateBirth: new Date(1985,06,22),
	cellphone: "3012776516",
	medicalRecordNumber: "987542234222",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(2015,01,15, 9, 0, 0),
	apptDuration: 15
},{
	firstName: "Emma",
	lastName: "Watson",
	dateBirth: new Date(1983,12,12),
	cellphone: "876543344",
	medicalRecordNumber: "678456232234",
	apptType: "RPV",
	currentState: "EX",
	apptTime: new Date(2015,01,15, 10, 0, 0),
	apptDuration: 15
},{
	firstName: "Daniel",
	lastName: "Radcliffe",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "987654323234",
	apptType: "RPV",
	currentState: "EX",
	apptTime: new Date(2015,01,15, 11, 0, 0),
	apptDuration: 15
},{
	firstName: "Chuck",
	lastName: "Norris",
	dateBirth: new Date(1985,06,22),
	cellphone: "3012776516",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date(2015,01,15, 12, 0, 0),
	apptDuration: 15
},{
	firstName: "Jackie",
	lastName: "Chan",
	dateBirth: new Date(1983,12,12),
	cellphone: "876543344",
	medicalRecordNumber: "345345765567",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date(2015,01,15, 13, 0, 0),
	apptDuration: 15
},{
	firstName: "Ryan",
	lastName: "Gosling",
	dateBirth: new Date(1985,06,22),
	cellphone: "3012776516",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date(2015,01,15, 14, 0, 0),
	apptDuration: 15
},{
	firstName: "Natalie",
	lastName: "Portman",
	dateBirth: new Date(1983,12,12),
	cellphone: "876543344",
	medicalRecordNumber: "345345765567",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date(2015,01,15, 14, 0, 0),
	apptDuration: 35
}];

var physiciansIds = [];

for (var i = 0; i < testPhysicians.length; i++) {
	
	var newUser = new User();
	newUser.username  = testPhysicians[i].username;
	newUser.password = newUser.generateHash(testPhysicians[i].password);
	newUser.name = testPhysicians[i].name;
	newUser.role = "Physician";
	newUser.save(function(err, savedUsr) {
	    if (err) console.log(err);
	    else {
	    	physiciansIds.push(savedUsr._id);
		    console.log("physician Added");
	    }
	});
};

setTimeout(function () {
	for (var i = 0; i < testPatients.length; i++) {
		var index = parseInt(Math.random() * 100) % physiciansIds.length;
		testPatients[i].physician = physiciansIds[index];
		patientController.nuevoPatient(testPatients[i], function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Added");
		});
	};
}, 2000);
