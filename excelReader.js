var cron         = require('cron');
var XLSX 		 = require('xlsx');
var _ 		 	 = require('underscore');
var mongoose     = require('mongoose');
var patientModel = require('./models/patientModel');
var surgeonModel = require('./models/surgeonModel');

//JOB CREATION
// --------------------------------------------------------------------------

function createCronJob () {
	var CronJob = cron.CronJob;

	var job = new CronJob('00 58 16 * * 1-7', function(){
		console.log('pertinent job!');
	    // SS MM HH * * 1-7
	    // 1-7 (dias de la semana)

	  }, function () {
	    // This function is executed when the job stops
	  },
	  true /* Start the job right now */
	);
}

function escribirExcel () {
	console.log("hakuna matata");
	mongoose.connect('mongodb://localhost:27017/fuse');

	patientModel.find({surgeryDate: {'$ne': null }}).populate("surgeon").exec(function (err, patientList) {
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
});

}

escribirExcel();

module.exports = {
	createCronJob: createCronJob,
	escribirExcel: escribirExcel
};

