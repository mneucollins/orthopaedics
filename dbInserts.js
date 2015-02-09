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
	username: "drpremkumar",
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
	apptTime: new Date().setHours(new Date().getHours() - 3),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 100),
	EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 90),
	DCTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15
},{
	firstName: "Eddy",
	lastName: "Murphy",
	dateBirth: new Date(1985,06,22),
	cellphone: "3185757889",
	medicalRecordNumber: "987542234222",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date().setHours(new Date().getHours() - 2),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 100),
	EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 90),
	DCTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15
},{
	firstName: "Emma",
	lastName: "Watson",
	dateBirth: new Date(1983,12,12),
	cellphone: "3185757889",
	medicalRecordNumber: "678456232234",
	apptType: "RPV",
	currentState: "EX",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 60),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 65),
	EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15
},{
	firstName: "Daniel",
	lastName: "Radcliffe",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "987654323234",
	apptType: "RPV",
	currentState: "EX",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 60),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 70),
	EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 30),
	apptDuration: 15
},{
	firstName: "Chuck",
	lastName: "Norris",
	dateBirth: new Date(1985,06,22),
	cellphone: "3185757889",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 5),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 3),
	apptDuration: 15
},{
	firstName: "Jackie",
	lastName: "Chan",
	dateBirth: new Date(1983,12,12),
	cellphone: "3185757889",
	medicalRecordNumber: "3453765567",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 11),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 15),
	apptDuration: 15
},{
	firstName: "Jackie",
	lastName: "Holmes",
	dateBirth: new Date(1983,12,12),
	cellphone: "3185757889",
	medicalRecordNumber: "34534576567",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 18),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15
},{
	firstName: "Jackie",
	lastName: "Jones",
	dateBirth: new Date(1983,12,12),
	cellphone: "3185757889",
	medicalRecordNumber: "5345765567",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 35),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 39),
	apptDuration: 15
},{
	firstName: "Jackie",
	lastName: "Slinger",
	dateBirth: new Date(1983,12,12),
	cellphone: "3185757889",
	medicalRecordNumber: "545765567",
	apptType: "RPV",
	currentState: "WR",
	apptTime: new Date().setMinutes(new Date().getMinutes() - 57),
	WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 60),
	apptDuration: 15
},{
	firstName: "Ryan",
	lastName: "Gosling",
	dateBirth: new Date(1985,06,22),
	// cellphone: "3185757889",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 5),
	apptDuration: 15
},{
	firstName: "Natalie",
	lastName: "Portman",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "345345765567",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 3),
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
