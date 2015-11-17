//var cron         = require('cron');
var XLSX 		 = require('xlsx');
var _ 		 	 = require('underscore');
var mongoose     = require('mongoose');
var moment = require('moment');

var emailController = require('./controllers/emailController');
var patientController = require('./controllers/patientController');
var patientModel = require('./models/patientModel');
var userModel = require('./models/userModel');
var config = require("./config.json");

module.exports = {
	leerExcel : leerExcel
}

//JOB CREATION
// --------------------------------------------------------------------------

function leerExcel () {
	console.log("hakuna matata - The loader is starting");
	mongoose.connect(config.databaseURL);

	//Load excel template
	var workbook = XLSX.readFile(config.excelFeedPath, {cellStyles:true});
	var sheet_name_list = workbook.SheetNames;
	var sheetName = workbook.SheetNames.length > 0 ? workbook.SheetNames[0] : 'eospine';
	var result = {};
	sheet_name_list.forEach(function(sheetName) {
		console.log("reading row...");
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});

	console.log("hakuna matata");
	var list = result[sheetName];
	console.log("starting to save!");

	userModel.find({}, function (err, physicians) {
		var totalPatients = list.length;
		var savedPatients = 0;
		var dummyApptDate, dummy;

		for(var k in list){

			if(list[k].ApptLoc != "EXP") {
				savedPatients++;
				continue;
			}

			var patient = new patientModel();

			patient.medicalRecordNumber = list[k].MRN;
			patient.lastName=list[k].LName;
			patient.firstName=list[k].MName ? list[k].FName+" "+list[k].MName : list[k].FName;
			patient.dateBirth=list[k].DOB;
			patient.email=list[k].Email;
			patient.adress=list[k].Addr_1 ? list[k].Addr_1 : "";
			patient.adress=list[k].Addr_2 ? patient.adress + " " + list[k].Addr_2 : patient.adress;
			patient.adress=list[k].City   ? patient.adress + ", " + list[k].City  : patient.adress;
			patient.adress=list[k].State  ? patient.adress + " " + list[k].State  : patient.adress;
			patient.adress=list[k].Zip    ? patient.adress + " " + list[k].Zip    : patient.adress;
			//patient.adress=list[k].Addr_1+" "+list[k].Addr_2+", "+list[k].City+" "+list[k].State+" "+list[k].Zip;
			patient.physician = _.find(physicians, function (physician) {
				return physician.npi == list[k].NPI;
			});
			patient.physician = patient.physician ? patient.physician.id : null;
			// var apptDummy = moment(list[k].Appt, "DD/MM/YYYY hh:mm:ss");
			// var apptDummy = moment(list[k].Appt);
			// patient.apptTime = apptDummy.toDate();
			patient.apptTime = list[k].Appt;
			patient.apptDuration = list[k].ApptLength;
			patient.apptType = list[k].ApptType;

			if(list[k].ApptType == "NPV")
				patient.apptType = "New";
			else if(list[k].ApptType == "RPV")
				patient.apptType = "Ret";
			else
				patient.patientType = list[k].ApptType;

			var now = new Date();
			if(patient.dateBirth.getFullYear() > now.getFullYear()) {
				var year = patient.dateBirth.getFullYear() - 100;
				patient.dateBirth.setFullYear(year);
			}

			console.log("saving patient: " + patient.lastName + ". Phy: " + patient.physician + ". Appt: " + patient.apptTime);
			dummyApptDate = list[k].Appt;

			patientController.nuevoPatient(patient, function (err, data) {
			    if(err) console.log(err);
			    else{
			    	console.log("Patient Added");
			    	savedPatients++;

			    	if(savedPatients >= totalPatients) {
			    		mongoose.connection.close();
			    		console.log("Connection is closed!");

			    		sendConfirmation(savedPatients, new Date(dummyApptDate));
			    	}
			    } 
			});
		}
	});

	//console.log(result);
}

function sendConfirmation (nPatients, theDate) {
	var body = "<p>Newly added patients: " + nPatients + "</p>" + 
				"<p>Appointment date: " + (theDate.getMonth() + 1) + "/" + theDate.getDate() + "/" + theDate.getFullYear() + "</p>";

	emailController.sendCustomMail("ezabaw@gmail.com", "Orthoworkflow Report", body);

}