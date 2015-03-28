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
	  true // Start the job right now *
	);
}*/

//function escribirExcel () {
	console.log("hakuna matata - The report starts to work");
	mongoose.connect('mongodb://localhost:27017/orthopaedics');


	//esto es solo para pruebas, se debe borrar al final

	var lowDate = new Date();
    lowDate.setHours(0);
    lowDate.setMinutes(0);
    lowDate.setSeconds(0);

    var highDate = new Date();
    highDate.setHours(0);
    highDate.setMinutes(0);
    highDate.setSeconds(0);
    highDate.setDate(highDate.getDate()+1);

    patientController.listPatientsBetweenDates(lowDate,highDate,function(err,patientList){
    	if(err)
    		return console.error(err);

    	_.each(patientList, function(patient,i,list){

    		var wrTime = 0;
    		var exTime = 0;
        	var totalTime = 0;
    		var wrDate = new Date(patient.WRTimestamp);
        	var apptDate = new Date(patient.apptTime);
        	var exDate = new Date(patient.EXTimestamp);
	        var dcDate = new Date(patient.DCTimestamp);
        	var nowDate = new Date();

    		//WRTime
    		if(patient.currentState != "NCI")
	        	if(patient.currentState == "WR")
	            	if(apptDate.getTime() < wrDate.getTime()) // in the case patient arrived late
	                	wrTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
	            	else
	                	wrTime = Math.round((nowDate.getTime() - apptDate.getTime()) / (60*1000));
	        	else 
	            	if(apptDate.getTime() < wrDate.getTime())
	                	wrTime = Math.round((exDate.getTime() - wrDate.getTime()) / (60*1000));
	            	else
	                	wrTime = Math.round((exDate.getTime() - apptDate.getTime()) / (60*1000));

    		//EXTime
    		if(patient.currentState != "NCI" && patient.currentState != "WR")
		        if(patient.currentState == "EX")
		            exTime = Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
		        else 
		            exTime = Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));

		        if(patient.currentState == "NCI") return 0;  

        	//TotalTime

	        if(patient.currentState == "EX" || patient.currentState == "WR")
	            totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
	        else 
	            totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));

	        totalTime = totalTime > 0 ? totalTime : 0;

    		console.log("patient "+i+" wrTime "+wrTime);

    	});

    });

	/*patientModel.find({surgeryDate: {'$ne': null }}).populate("surgeon").exec(function (err, patientList) {
	if (err) 
		return console.error(err);

	// console.log(patientList);
	console.log("base de datos leida");

	//Load excel template
	var workbook = XLSX.readFile('ExparelTest2.xlsx', {cellStyles:true});
	var sheet_name_list = workbook.SheetNames;
	var worksheet = workbook.Sheets["Hoja1"];

	var range = {s: {c:0,r:0}, e:{c:19, r: patientList.length + 3}};
	worksheet['!ref'] = XLSX.utils.encode_range(range);
	// var range = {s: {c:2,r:0}, e:{c:19, r: 15}};

	var R = range.s.r + 3;
	for (var i = 0; i < patientList.length; i++) {
		var patient = patientList[i];
		var patientJournals = _.sortBy(patient.painJournal, function (journal) { return journal.day; });

		for (var j = 0; j < patientJournals.length; j++, ++R) {
			var data = [];
			data.push({data: patient.fuseId, tipo: "s"});
			data.push({data: patient.surgeon.name, tipo: "s"});
			data.push({data: patientJournals[j].day, tipo: "n"});
			data.push({data: patientJournals[j].timestamp, tipo: "d"});
			data.push({data: patientJournals[j].painScore, tipo: "n"});
			data.push({data: patientJournals[j].sideEffects, tipo: "s"});
			data.push({data: patientJournals[j].comments, tipo: "s"});
			data.push({data: patientJournals[j].kneePoints.join(", "), tipo: "s"});

			// TODO sacar por día los meds y agregarlos

			console.log("datos armados");

			for(var C = 0; C < data.length; C++) {
				var cellAddr = XLSX.utils.encode_cell({c:C, r:R});
				var cellData = {
					t: data[C].tipo, 
					v: data[C].data
				};

				worksheet[cellAddr] = cellData;
			}
		};
	}

  	XLSX.writeFile(workbook, 'out.xlsx');
  	console.log("archivo escrito :)");
});*/

//}

/*escribirExcel();

module.exports = {
	createCronJob: createCronJob,
	escribirExcel: escribirExcel
};*/

