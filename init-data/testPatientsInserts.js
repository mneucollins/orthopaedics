var mongoose = require('mongoose');
var patientController = require('../controllers/patientController');
var physicianController = require('../controllers/physicianController');

var config = require("../config.json");

mongoose.connect(config.databaseURL);

var nPlusHours = 0;

var initYear = 2016,
	initMonth = 6,
	initDay = 25,
	initHours = 10,
	initMinutes = 00;


var testPatients = [{
	firstName: "Doug",
	lastName: "Morris",
	dateBirth: new Date(1987,11,26),
	cellphone: "4042170976",
	medicalRecordNumber: "111122223333",
	apptType: "New",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + nPlusHours*60),
	apptDuration: 15,
	email: "doug@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Don",
	lastName: "Brunn",
	dateBirth: new Date(1987,11,26),
	cellphone: "4047345121",
	medicalRecordNumber: "111122223330",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "don@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Alan",
	lastName: "Dubovsky",
	dateBirth: new Date(1987,11,26),
	cellphone: "4046440496",
	medicalRecordNumber: "101122223333",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "alan@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Alan",
	lastName: "Kramer",
	dateBirth: new Date(1987,11,26),
	cellphone: "4042171956",
	medicalRecordNumber: "111122223300",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "alank@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Joe",
	lastName: "John",
	dateBirth: new Date(1987,11,26),
	cellphone: "6154033797",
	medicalRecordNumber: "111122220033",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "joe@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Deena",
	lastName: "Gilland",
	dateBirth: new Date(1987,11,26),
	cellphone: "4043231467",
	medicalRecordNumber: "111122003333",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "deena@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Mike",
	lastName: "Hattery",
	dateBirth: new Date(1987,11,26),
	cellphone: "4046933035",
	medicalRecordNumber: "111100223333",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "mike@mail.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Diane",
	lastName: "Woods",
	dateBirth: new Date(1987,11,26),
	cellphone: "8653103389",
	medicalRecordNumber: "110022223333",
	apptType: "New",
	currentState: "NCI",
	apptDuration: 15,
	email: "diane@mail.com",
	adress: "32th Park Road Miami, FL"
}];

physicianController.listarPhysicians(function (err, physicians) {
	for (var i = 0; i < testPatients.length; i++) { // 
		var index = 0;
		do {
			index = parseInt(Math.random() * 100) % 3;//physicians.length;
			// console.log(index);
		}while(index != 1 && index != 2);

		var apptTime = new Date(initYear, initMonth, initDay, initHours);
		apptTime.setMinutes(initMinutes + i*20);

		testPatients[i].physician = physicians[index].id;
		testPatients[i].apptTime = apptTime;

		patientController.nuevoPatient(testPatients[i], function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Added");
		});
	};
});
