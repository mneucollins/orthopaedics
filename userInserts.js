var mongoose = require('mongoose');
var patientController = require('./controllers/patientController');
var User = require('./models/userModel');

var config = require("./config.json");

mongoose.connect(config.databaseURL);

var users = [
	// FIRST PROVIDER

	// {name: "Jennifer Hudson", department: "RN", username: "eophvj", role: "FirstProvider"},
	// {name: "Vanessa Moore-Laneheart", department: "RN", username: "mnsmvv", role: "FirstProvider"},
	// {name: "Andrea Thomas", department: "MA", username: "n279188", role: "FirstProvider"},
	// {name: "Whitney George", department: "RN", username: "n734045", role: "FirstProvider"},
	// {name: "Lisa Swanson", department: "MA", username: "eopsal", role: "FirstProvider"},
	// {name: "Hope Harley", department: "LPN", username: "eopshx", role: "FirstProvider"},
	// {name: "Douglas Flanagan", department: "LPN", username: "epc5fdd", role: "FirstProvider"},
	// {name: "Lisa Pierson", department: "LPN", username: "eopplj", role: "FirstProvider"},
	// {name: "Meda Childress-Walters", department: "RN", username: "n649689", role: "FirstProvider"},
	// {name: "Lauren Heeke", department: "RN", username: "n120789", role: "FirstProvider"},
	// {name: "Jill Gross", department: "LPN", username: "n969585", role: "FirstProvider"},
	// {name: "Bruce Rudder", department: "MA", username: "n339517", role: "FirstProvider"},
	// {name: "Louise Fowler", department: "RN", username: "a371617", role: "FirstProvider"},
	// {name: "Betty Dundee", department: "RN", username: "eopfbe", role: "FirstProvider"},
	// {name: "Gina Hankers", department: "RN", username: "n586721", role: "FirstProvider"},
	// {name: "James Edmunds", department: "LPN", username: "mnseja", role: "FirstProvider"},
	// {name: "Cassandra Kelly", department: "RN", username: "n134467", role: "FirstProvider"},
	// {name: "Shawnee Wallace", department: "MA", username: "n359826", role: "FirstProvider"},
	// {name: "Marvis Davis", department: "RN", username: "n591878", role: "FirstProvider"},
	// {name: "Liz Berman", department: "MA", username: "eopbep", role: "FirstProvider"},
	// {name: "Angela Glasgow", department: "MA", username: "n520577", role: "FirstProvider"},
	// {name: "Agnes Kessie", department: "MA", username: "n590559", role: "FirstProvider"},
	// {name: "Jalisa Collins", department: "MA", username: "n543562", role: "FirstProvider"},
	// {name: "Dennis Burke", department: "MA", username: "n742582", role: "FirstProvider"},

	// {name: "Dheera Ananthakrishnan", username: "DAnanth", role: "FirstProvider"},
	// {name: "Jose Garcia-Corrada", username: "JGarcia", role: "FirstProvider"},
	// {name: "Scott Boden", username: "SBoden", role: "FirstProvider"},
	// {name: "John Heller", username: "JHeller", role: "FirstProvider"},
	// {name: "Jeremy Beckworth", username: "JBeckwo", role: "FirstProvider"},
	// {name: "David Hubbell", username: "DHubbel", role: "FirstProvider"},
	// {name: "Randy Katz", username: "RKatz", role: "FirstProvider"},
	// {name: "Di Cui", username: "DCui", role: "FirstProvider"},
	// {name: "Susan Dreyer", username: "Sdreyer", role: "FirstProvider"},
	// {name: "Howard Levy", username: "HLevy", role: "FirstProvider"},
	// {name: "John Rhee", username: "JRhee", role: "FirstProvider"},
	// {name: "Keith Michael", username: "KMichae", role: "FirstProvider"},
	// {name: "Gerald Rodts", username: "GRodts", role: "FirstProvider"},
	// {name: "Diana Sodiq", username: "DSodiq", role: "FirstProvider"},
	// {name: "Hassan Monfared", username: "Hmonfar", role: "FirstProvider"},
	// {name: "Daniel Refai", username: "Drefai", role: "FirstProvider"},
	// {name: "Tim Yoon", username: "TYoon", role: "FirstProvider"},

	// {name: "Ajay Premkumar", username: "APremku", role: "FirstProvider"},
	// {name: "Andrew Wurtzel", username: "n788017", role: "FirstProvider"},
	// {name: "Ben Mennis", username: "n250725", role: "FirstProvider"},

	// // // IMAGING

	// {name: "Ashlyn Bierman", username: "n748829", role: "Imaging"},
	// {name: "Julia Chappell", username: "n736037", role: "Imaging"},
	// {name: "Betsy Collins", username: "exrcbl", role: "Imaging"},
	// {name: "Ahmed Fadl", username: "n11730", role: "Imaging"},
	// {name: "Matthew Green", username: "n852691", role: "Imaging"},
	// {name: "Kim Landmon", username: "exrlkr", role: "Imaging"},
	// {name: "George McMaster", username: "n304722", role: "Imaging"},
	// {name: "Loredana Nitti", username: "n481576", role: "Imaging"},
	// {name: "Emilia Rodriguez", username: "n414193", role: "Imaging"},
	// {name: "Debbie Slappey", username: "slasdh", role: "Imaging"},
	// {name: "Jason Smitherman", username: "n951491", role: "Imaging"},
	// {name: "Nancy Stauffer", username: "exr5snx", role: "Imaging"},
	// {name: "Gretchen Hill", username: "exragl", role: "Imaging"},
	// {name: "Kristen Smith", username: "n034824", role: "Imaging"},
	// {name: "Susan Knight", username: "eraksl", role: "Imaging"},
	// {name: "Karen Kallianos", username: "n696428", role: "Imaging"},
	// {name: "Mark Lux", username: "exrlmx", role: "Imaging"},
	// {name: "Stewart Johnson", username: "mxr6jsm", role: "Imaging"},
	// {name: "Terry Mulvey", username: "mxrmtw", role: "Imaging"},
	// {name: "Laura Higgons", username: "n350685", role: "Imaging"},
	// {name: "Shana Brown", username: "ebobds", role: "Imaging"},
	// {name: "Maria Narvaez", username: "n713524", role: "Imaging"},

	// //   Alycia Sutton	n713524

	// // FRONT OFFICE

	// {name: "Cedric Brevard", username: "n715790", role: "Receptionist"},
	// {name: "Latonia Smith", username: "n896329", role: "Receptionist"},
	// {name: "Bea Garcia (supervisor)", username: "eopgbd", role: "Receptionist"},
	// {name: "Medina Hammond", username: "ebo5hmm", role: "Receptionist"},
	// {name: "Fallon Thomas", username: "n787696", role: "Receptionist"},
	// {name: "Christine Osborne", username: "n475414", role: "Receptionist"},
	// {name: '"Precious" Eghosa Asoro', username: "n992303", role: "Receptionist"},
	// {name: "Claudia Casserly", username: "n972856", role: "Receptionist"},
	// {name: "Stephen Parker", username: "n554290", role: "Receptionist"},
	// {name: "Karene Francis", username: "n365655", role: "Receptionist"},
	// {name: "Ebony King", username: "n348402", role: "Receptionist"},
	// {name: "Charlandra Williams", username: "n106414", role: "Receptionist"},



	// {name: "Dr. Xerogeanes", username: "JXeroge", role: "FirstProvider"},
	// {name: "Dr. Mautner", username: "KMautne", role: "FirstProvider"},
	// {name: "Dr. Mines", username: "BMines", role: "FirstProvider"},
	// {name: "Dr. Webb", username: "AWebb", role: "FirstProvider"},
	// {name: "Dr. Karas", username: "SKaras", role: "FirstProvider"},
	// {name: "Dr. Labib", username: "SLabib", role: "FirstProvider"},
	// {name: "Dr. Hammond", username: "KHammon", role: "FirstProvider"},
	// {name: "Dr. Mason", username: "RMason", role: "FirstProvider"},
	
	// {name: "Bonecutter, Kat", username: "n252932", role: "FirstProvider"},
	// {name: "Hof, Melanie", username: "n631160", role: "FirstProvider"},
	// {name: "Kindall, Jamila", username: "n011531", role: "FirstProvider"},
	// {name: "Bedard, Becky", username: "n099031", role: "FirstProvider"},
	// {name: "East, Megan", username: "n063040", role: "FirstProvider"},
	// {name: "Vazquez, Lori", username: "n569240", role: "FirstProvider"},
	// {name: "Hecht, Tracey", username: "n403379", role: "FirstProvider"},
	// {name: "Fitts, Lynette", username: "n950350", role: "FirstProvider"},
	// {name: "Butts, Geanie", username: "n979237", role: "FirstProvider"},

	// {name: "Campbell, Kim", username: "h004819", role: "Receptionist"},
	// {name: "Logan, Jacob", username: "n648058", role: "Receptionist"},
	// {name: "Settoon, Brittany", username: "n250676", role: "Receptionist"},
	// {name: "Taylor, Jamese", username: "n430183", role: "Receptionist"},
	
	// {name: "Sutton, Alycia", username: "RMason", role: "Receptionist"},

	// {name: "Kingsley, Payton", username: "pnkings", role: "FirstProvider"},
	// {name: "Rodik, Tristan", username: "trodik", role: "FirstProvider"},
	// {name: "Teboda, Jordan", username: "jteboda", role: "FirstProvider"},
	// {name: "Brueck, Lauren", username: "lbrueck", role: "FirstProvider"},
	// {name: "Brigham, Carmen", username: "cbrigha", role: "FirstProvider"},
	// {name: "Pittman, J'nai", username: "jpittm8", role: "FirstProvider"},
	// {name: "Ortega, Erika", username: "n319533", role: "FirstProvider"},
	{name: "Watson, Patrisha", username: "n729468", role: "FirstProvider"},

	// {name: "Neumeyer, Jeanie", username: "n363435", role: "FirstProvider"},
	// {name: "Madera, Meraris", username: "n924258", role: "Receptionist"},
	// {name: "Bailey, Debbie", username: "eopbdk", role: "Receptionist"},

	// {name: "First PROVIDERder", username: "first", role: "FirstProvider"},
	// {name: "Admin", username: "admin", role: "FirstProvider", isAdmin: true},
];

for (var i = 0; i < users.length; i++) {
	
	var newUser = new User(users[i]);
	newUser.password = newUser.generateHash("123456");

	newUser.save(function(err, savedUsr) {
	    if (err) console.log(err);
	    else {
		    console.log("User Added: " + savedUsr.name);
	    }
	});
};
