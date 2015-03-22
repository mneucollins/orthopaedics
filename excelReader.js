//var cron         = require('cron');
var XLSX 		 = require('xlsx');
var _ 		 	 = require('underscore');
var mongoose     = require('mongoose');
var patientController = require('./controllers/patientController');
var patientModel = require('./models/patientModel');
var userModel = require('./models/userModel');

//JOB CREATION
// --------------------------------------------------------------------------

/*function createCronJob () {
	var CronJob = cron.CronJob;

	var job = new CronJob('00 58 16 * * 1-7', function(){
		console.log('pertinent job!');
	    // SS MM HH * * 1-7
	    // 1-7 (dias de la semana)

	  }, function () {
	    // This function is executed when the job stops
	  },
	  true /* Start the job right now */
	/*);
}*/

//function leerExcel () {
	console.log("hakuna matata - The loader is starting");
	mongoose.connect('mongodb://localhost:27017/orthopaedics');

	//Load excel template
	var workbook = XLSX.readFile('HL7.xlsx', {cellStyles:true});
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
		for(var k in list){

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
			patient.apptTime = list[k].Appt;
			patient.apptDuration = list[k].ApptLength;
			patient.apptType = list[k].ApptType;

			if(list[k].ApptType == "NPV")
				patient.apptType = "New";
			else if(list[k].ApptType == "RPV")
				patient.apptType = "Ret";
			else
				patient.patientType = list[k].ApptType;

			console.log("saving patient: " + patient.lastName + ". Phy: " + patient.physician);
			patientController.nuevoPatient(patient, function (err, data) {
			    if(err) console.log(err);
			    else console.log("Patient Added");
			});
		}
	});

	//console.log(result);



