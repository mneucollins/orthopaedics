//var cron         = require('cron');
var XLSX 		 = require('xlsx');
//var _ 		 	 = require('underscore');
var mongoose     = require('mongoose');
var patientController = require('./controllers/patientController');
var patientModel = require('./models/patientModel');

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
	var workbook = XLSX.readFile('proofReading.xlsx', {cellStyles:true});
	var sheet_name_list = workbook.SheetNames;

	var result = {};
	sheet_name_list.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});

	var list = result['Hoja1'];
    var patient = new patientModel();

	for(var k in list){
		//console.log(k,list[k]);
		patient.firstName = list[k].firstName;
        
		patientController.nuevoPatient(patient, function (err, data) {
		    if(err) console.log(err);
		    else console.log("Patient Added");
		});
	}

	//console.log(result);



