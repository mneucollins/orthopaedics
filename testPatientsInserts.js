var mongoose = require('mongoose');
var patientController = require('./controllers/patientController');
var physicianController = require('./controllers/physicianController');
var User = require('./models/userModel');

var config = require("./config.json");

mongoose.connect(config.databaseURL);

var nPlusHours = 0;

var testPatients = [{
	firstName: "Tom",
	lastName: "Hanks",
	dateBirth: new Date(1987,11,26),
	// cellphone: "3185757889",
	medicalRecordNumber: "234456123231",
	apptType: "RPV",
	// currentState: "DC",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + nPlusHours*60),
	// apptTime: new Date().setHours(new Date().getHours() - 3),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 100),
	// EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 90),
	// DCTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15,
	email: "mtommy@yahoo.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Tom",
	lastName: "Hanks",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "234456123231",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(new Date().setHours(new Date().getHours() - 2)).setDate(new Date().getDate()-1),
	WRTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 100)).setDate(new Date().getDate()-1),
	EXTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 90)).setDate(new Date().getDate()-1),
	DCTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 20)).setDate(new Date().getDate()-1),
	apptDuration: 15,
	email: "mtommy@yahoo.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Tom",
	lastName: "Hanks",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "234456123231",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(new Date().setHours(new Date().getHours() - 3)).setDate(new Date().getDate()-2),
	WRTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 90)).setDate(new Date().getDate()-2),
	EXTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 60)).setDate(new Date().getDate()-2),
	DCTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 10)).setDate(new Date().getDate()-2),
	apptDuration: 15,
	email: "mtommy@yahoo.com",
	adress: "20 Est 23rd Street New York City"
},{
	firstName: "Eddy",
	lastName: "Murphy",
	dateBirth: new Date(1985,06,22),
	// cellphone: "3185757889",
	medicalRecordNumber: "987542234222",
	apptType: "RPV",
	// currentState: "DC",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 15 + nPlusHours*60),
	// apptTime: new Date().setHours(new Date().getHours() - 2),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 100),
	// EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 90),
	// DCTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15,
	email: "murphy12@yahoo.com",
	adress: "12 South 9rd Street New York City"
},{
	firstName: "Emma",
	lastName: "Watson",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "678456232234",
	apptType: "RPV",
	// currentState: "EX",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 25 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 60),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 65),
	// EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15,
	email: "emma98@yahoo.com",
	adress: "38 West 3rd Street New York City"
},{
	firstName: "Daniel",
	lastName: "Radcliffe",
	dateBirth: new Date(1987,11,26),
	// cellphone: "3185757889",
	medicalRecordNumber: "987654323234",
	apptType: "RPV",
	// currentState: "EX",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 40 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 60),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 70),
	// EXTimestamp: new Date().setMinutes(new Date().getMinutes() - 30),
	apptDuration: 15,
	email: "expelliarmus@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Chuck",
	lastName: "Norris",
	dateBirth: new Date(1985,06,22),
	// cellphone: "3185757889",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	// currentState: "WR",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 45 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 5),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 3),
	apptDuration: 15,
	email: "chuckthegreat@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Chuck",
	lastName: "Norris",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(new Date().setHours(new Date().getHours() + 2)).setDate(new Date().getDate()-2),
	WRTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 119)).setDate(new Date().getDate()-2),
	EXTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 130)).setDate(new Date().getDate()-2),
	DCTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 160)).setDate(new Date().getDate()-2),
	apptDuration: 15,
	email: "chuckthegreat@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Chuck",
	lastName: "Norris",
	dateBirth: new Date(1987,11,26),
	cellphone: "3185757889",
	medicalRecordNumber: "234235465456",
	apptType: "RPV",
	currentState: "DC",
	apptTime: new Date(new Date().setHours(new Date().getHours() + 5)).setDate(new Date().getDate()-4),
	WRTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 270)).setDate(new Date().getDate()-4),
	EXTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 310)).setDate(new Date().getDate()-4),
	DCTimestamp: new Date(new Date().setMinutes(new Date().getMinutes() + 350)).setDate(new Date().getDate()-4),
	apptDuration: 15,
	email: "chuckthegreat@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Jackie",
	lastName: "Chan",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "3453765567",
	apptType: "RPV",
	// currentState: "WR",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 50 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 11),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 15),
	apptDuration: 15,
	email: "chanchanchan@gmail.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Jackie",
	lastName: "Holmes",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "34534576567",
	apptType: "RPV",
	// currentState: "WR",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 60 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 18),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 20),
	apptDuration: 15,
	email: "holmes32@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Jackie",
	lastName: "Jones",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "5345765567",
	apptType: "RPV",
	// currentState: "WR",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 75 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 35),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 39),
	apptDuration: 15,
	email: "jonesnbones@gmail.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Jackie",
	lastName: "Slinger",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "545765567",
	apptType: "RPV",
	// currentState: "WR",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 90 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() - 57),
	// WRTimestamp: new Date().setMinutes(new Date().getMinutes() - 60),
	apptDuration: 15,
	email: "slingermasta@gmail.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Ryan",
	lastName: "Gosling",
	dateBirth: new Date(1985,06,22),
	// cellphone: "3185757889",
	medicalRecordNumber: "234235464456",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 100 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() + 5),
	apptDuration: 15,
	email: "iamryan@yahoo.com",
	adress: "338 West 23rd Street New York City"
},{
	firstName: "Natalie",
	lastName: "Portman",
	dateBirth: new Date(1983,12,12),
	// cellphone: "3185757889",
	medicalRecordNumber: "345345765567",
	apptType: "RPV",
	currentState: "NCI",
	apptTime: new Date().setMinutes(new Date().getMinutes() + 110 + nPlusHours*60),
	// apptTime: new Date().setMinutes(new Date().getMinutes() + 3),
	apptDuration: 35,
	email: "natalie.portman@yahoo.com",
	adress: "338 West 23rd Street New York City"
}];


physicianController.listarPhysicians(function (err, physicians) {
	for (var i = 0; i < testPatients.length; i++) {
		var index = parseInt(Math.random() * 100) % physicians.length;
		testPatients[i].physician = physicians[index].id;
		patientController.nuevoPatient(testPatients[i], function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Added");
		});
	};
});
