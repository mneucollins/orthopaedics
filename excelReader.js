//var cron         = require('cron');
var XLSX 		 = require('xlsx');
//var _ 		 	 = require('underscore');
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
	console.log("hakuna matata");
	mongoose.connect('mongodb://localhost:27017/orthopaedics');

	//Load excel template
	var workbook = XLSX.readFile('ScheduleExport.xlsx', {cellStyles:true});
	var sheet_name_list = workbook.SheetNames;

	var result = {};
	sheet_name_list.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});

	var list = result['ScheduleExport'];

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
		patient.physician = userModel.find({npi:list[k].NPI});
		patient.apptTime = list[k].Appt;
		patient.apptDuration = list[k].ApptLength;
		if(list[k].ApptType == "RPV" || list[k].ApptType == "NPV"){
			patient.apptType=list[k].ApptType;
		}




		        
		patientController.nuevoPatient(patient, function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Added");
		});
	}

	//console.log(result);



