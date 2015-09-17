var mongoose = require('mongoose');
var patientController = require('./controllers/patientController');
var User = require('./models/userModel');

var config = require("./config.json");

mongoose.connect(config.databaseURL);

var nPlusHours = 0;
var testPhysicians = [{npi:"8221653205216597",name:"Dr. X",username:"drx",password:"123456",role:"Physician"},
	{npi:"1427150150",name:"Dr. Mines",username:"brandomi",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1396921664",name:"Dr. Jarrett",username:"claudeja",password:"123456",role:"Physician",department:"Hand & Upper Extremity"},
	{npi:"1962421859",name:"Dr. Jarrett",username:"claudiusja",password:"123456",role:"Physician",department:"Hand & Upper Extremity"},
	{npi:"1912092800",name:"Dr. Refai",username:"danielref",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1205930708",name:"Dr. Hubbell",username:"davidhubb",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1225130958",name:"Dr. Monson",username:"davidmon",password:"123456",role:"Physician",department:"Musculoskeletal Oncology"},
	{npi:"1780768192",name:"Dr. Ananthakrishnan",username:"dheeraana",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1033351192",name:"Dr. Cui",username:"dicui",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1073791190",name:"Dr. Sodiq",username:"dianaso",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1003918707",name:"Dr. McGillivary",username:"garymcg",password:"123456",role:"Physician",department:"Hand & Upper Extremity"},
	{npi:"1811944861",name:"Dr. Rodts",username:"geraldrod",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1295761450",name:"Dr. Erens",username:"gregere",password:"123456",role:"Physician",department:"Adult Reconstruction"},
	{npi:"1790714368",name:"Dr. Monfared",username:"hassanmon",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1437251162",name:"Dr. Levy",username:"howardlevy",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1982614921",name:"Dr. Chappuis",username:"jamescha",password:"123456",role:"Physician",department:""},
	{npi:"1437265055",name:"Dr. Roberson",username:"jamesrob",password:"123456",role:"Physician",department:"Adult Reconstruction"},
	{npi:"1023039807",name:"Dr. Webb",username:"jeffreywebb",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1528025228",name:"Dr. Heller",username:"johnhe",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1134221872",name:"Dr. Rhee",username:"johnrhee",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1346342045",name:"Dr. X",username:"johnxe",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1821035429",name:"Dr. Rodriguez",username:"jorgero",password:"123456",role:"Physician",department:"General Orthopaedics"},
	{npi:"1790889285",name:"Dr. Garcia-Corrada",username:"josega",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1033385679",name:"Dr. Michael",username:"keithmi",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1942302682",name:"Dr. Mautner",username:"kennethmau",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1164609566",name:"Dr. Hammond",username:"kyleha",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1346413648",name:"Dr. Pombo",username:"matthewpom",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1205983178",name:"Dr. Fletcher",username:"nicholasfle",password:"123456",role:"Physician",department:"Pediatric Orthopaedics"},
	{npi:"1043453111",name:"Dr. Reimer",username:"nickolasrei",password:"123456",role:"Physician",department:"Musculoskeletal Oncology"},
	{npi:"1053502716",name:"Dr. Olufade",username:"oluseunolu",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1295851087",name:"Dr. Mason",username:"amadeusma",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1770685463",name:"Dr. Calis",username:"ramica",password:"123456",role:"Physician",department:"Podiatry"},
	{npi:"1124120829",name:"Dr. Katz",username:"randykatz",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1972605681",name:"Dr. Bruce",username:"robertbru",password:"123456",role:"Physician",department:"Pediatric Orthopaedics"},
	{npi:"1992810105",name:"Dr. Yoon",username:"timyoon",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1962518969",name:"Dr. Labib",username:"samehla",password:"123456",role:"Physician",department:"Foot & Ankle"},
	{npi:"1134234990",name:"Dr. Boden",username:"scottbo",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1124120852",name:"Dr. Oskouei",username:"shervinos",password:"123456",role:"Physician",department:"Musculoskeletal Oncology"},
	{npi:"1104832906",name:"Dr. Karas",username:"speroka",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1871506279",name:"Dr. Dreyer",username:"susandre",password:"123456",role:"Physician",department:"Spine"},
	{npi:"1417028507",name:"Dr. Maughon",username:"scottmau",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"1720019698",name:"Dr. Bradbury",username:"thomasbra",password:"123456",role:"Physician",department:"Adult Reconstruction"},
	{npi:"1669689865",name:"Dr. Beckworth",username:"jeremybeck",password:"123456",role:"Physician",department:"Spine"},
	{npi:"9000000001",name:"Diane Butler",username:"dianebu",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"9000000002",name:"Sydney Wang",username:"sydneywang",password:"123456",role:"Physician",department:"Sports Medicine"},
	{npi:"9000000003",name:"Dr. Michael Gottschalk",username:"michaelgot",password:"123456",role:"Physician",department:"Sports Medicine"}];

// var testUsrs = [{name:"Imaging User",username:"imaging",password:"123456",role:"Imaging"},
// 	{name:"first Provider User",username:"first",password:"123456",role:"FirstProvider"},
// {name:"Front Office",username:"frontoffice",password:"123456",role:"Receptionist"}];

// var testUsrs = [{name:"psat", username:"psat",password:"54321",role:"Imaging", isAdmin: true}];

for (var i = 0; i < testPhysicians.length; i++) {
	
	var newUser = new User();
	newUser.username  = testPhysicians[i].username;
	newUser.password = newUser.generateHash(testPhysicians[i].password);
	newUser.name = testPhysicians[i].name;
	newUser.npi = testPhysicians[i].npi;
	newUser.department = testPhysicians[i].department;
	
	newUser.role = "Physician";
	newUser.save(function(err, savedUsr) {
	    if (err) console.log(err);
	    else {
		    console.log("physician Added");
	    }
	});
};

// for (var i = 0; i < testUsrs.length; i++) {
	
// 	var newUser = new User();
// 	newUser.username  = testUsrs[i].username;
// 	newUser.password = newUser.generateHash(testUsrs[i].password);
// 	newUser.name = testUsrs[i].name;
// 	newUser.role = testUsrs[i].role;
// 	newUser.isAdmin = testUsrs[i].isAdmin;
// 	newUser.department = testUsrs[i].department;
// 	newUser.save(function(err, savedUsr) {
// 	    if (err) console.log(err);
// 	    else {
// 		    console.log("test User Added");
// 	    }
// 	});
// };
