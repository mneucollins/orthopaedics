var XLSX 		 = require('xlsx');
var excelbuilder = require('msexcel-builder');
var _ 		 	 = require('underscore');
var moment 		 = require('moment');
var mongoose     = require('mongoose');
var exec         = require('child_process').exec;

var patientController = require('../controllers/patientController');
var physicianController = require('../controllers/physicianController');
var userModel = require("../models/userModel")
var tools = require('../tools');
var config = require('../config');

module.exports = {
	generatePatientReportBetweenDates : generatePatientReportBetweenDates,
	listarUsuarios : listarUsuarios,
	generatePhySummary: generatePhySummary
}

function generatePatientReportBetweenDates (lowDate, highDate, callback) {
	//para usar cuándo no está ejecutándose la aplicación
	// mongoose.connect(config.databaseURL);
	var nombreArc = "";
	console.log("Generating report between " + lowDate + " and " + highDate);

    patientController.listPatientsBetweenDates(lowDate, highDate, function(err,patientList){
    	if(err) {
    		callback(err);
    		return;
    	}

	  	escribirExcel(patientList, callback);
    });
}

function generatePatientReportDaySelection(lowDate, highDate, daysOfWeek, callback) {
	//para usar cuándo no está ejecutándose la aplicación
	// mongoose.connect(config.databaseURL);
	var nombreArc = "";
	console.log("Generating report between " + lowDate + " and " + highDate);

    patientController.listPatientsBetweenDates(lowDate, highDate, function(err, patientList){
    	if(err) {
    		callback(err);
    		return;
    	}

    	var newPatientList = _.filter(patientList, function (pat) {
    		return daysOfWeek.indexOf(moment(pat.timestamp).day()) != -1;
    	});

	  	escribirExcel(newPatientList, callback);
    });
}

function escribirExcel (patientList, callback) {

	// console.log("Total patients: " + patientList.length);
	//Load excel template
	var workbook = XLSX.readFile(config.reportTemplatePath, {cellStyles:true});
	var sheet_name_list = workbook.SheetNames;
	var worksheet = workbook.Sheets["PatientStats"];

	var range = {s: {c:0,r:0}, e:{c:17, r: patientList.length + 1}};
	worksheet['!ref'] = XLSX.utils.encode_range(range);

	var R = range.s.r + 1;

	for(var i=0 ; i<patientList.length ; i++, ++R ){

		var patient = patientList[i];
		var name = patient.firstName ? patient.firstName + " " : "" ;
		name = patient.lastName ? name + patient.lastName : name;
		var physician = patient.physician ? patient.physician.name : "";
		var apptType = patient.apptType ? patient.apptType : "";

		var apptDate = patient.apptTime ? moment(patient.apptTime).format("DD/MM/YYYY") : "";
		var apptTime = patient.apptTime ? moment(patient.apptTime).format("HH:mm:ss") : "";
		var wrTime = patient.WRTimestamp ? moment(patient.WRTimestamp).format("HH:mm:ss") : "";
		var exTime = patient.EXTimestamp ? moment(patient.EXTimestamp).format("HH:mm:ss") : "";
		var dcTime = patient.DCTimestamp ? moment(patient.DCTimestamp).format("HH:mm:ss") : "";

		var fcStart = patient.fcStartedTimestamp ? moment(patient.fcStartedTimestamp).format("HH:mm:ss") : "";
		var fcEnd = patient.fcFinishedTimestamp ? moment(patient.fcFinishedTimestamp).format("HH:mm:ss") : "";
		
		var imagingStart = patient.imagingStartedTimestamp ? moment(patient.imagingStartedTimestamp).format("HH:mm:ss") : "";
		var imagingEnd = patient.imagingTimestamp ? moment(patient.imagingTimestamp).format("HH:mm:ss") : "";
		var imagingTotal = patient.imagingTimestamp && patient.imagingStartedTimestamp ? Math.round((patient.imagingTimestamp.getTime() - patient.imagingStartedTimestamp.getTime()) / (60*1000)) : "";

		var timeFromAppt = tools.getWRTime(patient);
		var wrTotalTime = patient.EXTimestamp ? Math.round((patient.EXTimestamp.getTime() - patient.WRTimestamp.getTime()) / (60*1000)) : 0;
		var exTotalTime = tools.getEXTime(patient);
		var totalTime = tools.getTotalTime(patient);
		
		var atTotalTime = tools.getATtimer(patient);
		
		if(patient.fcStartedTimestamp && patient.fcFinishedTimestamp){
			Math.round((patient.fcFinishedTimestamp.getTime() - patient.fcStartedTimestamp.getTime()) / (60*1000));
		}

		var data = [];

		data.push({data: patient.medicalRecordNumber, tipo: "s"});
		data.push({data: name, tipo: "s"});
		data.push({data: physician, tipo: "s"});
		data.push({data: apptType, tipo: "s"});
		data.push({data: apptDate, tipo: "s"});
		data.push({data: apptTime, tipo: "s"});
		data.push({data: wrTime, tipo: "s"});
		data.push({data: exTime, tipo: "s"});
		data.push({data: dcTime, tipo: "s"});
		data.push({data: fcStart, tipo: "s"});
		data.push({data: fcEnd, tipo: "s"});
		// data.push({data: !!patient.imagingRequestedTimestamp, tipo: "b"});
		data.push({data: imagingStart, tipo: "s"});
		data.push({data: imagingEnd, tipo: "s"});
		data.push({data: imagingTotal, tipo: "s"});

		data.push({data: timeFromAppt, tipo: "s"});
		data.push({data: wrTotalTime, tipo: "s"});
		data.push({data: exTotalTime, tipo: "s"});
		data.push({data: totalTime, tipo: "s"});
		data.push({data: atTotalTime, tipo: "s"});

		for(var C = 0; C < data.length; C++) {
			var cellAddr = XLSX.utils.encode_cell({c:C, r:R});
			var cellData = {
				t: data[C].tipo, 
				v: data[C].data
			};

			worksheet[cellAddr] = cellData;
		}
	}
	
	var dateReport = new Date();
	var month = Math.round(dateReport.getMonth()+1);
	nombreArc = 'report' + dateReport.getFullYear()
		+ '_' + month +'_' + dateReport.getDate()
		+ '_' + dateReport.getHours() + dateReport.getMinutes()
		+ dateReport.getSeconds() + '.xlsx';

  	XLSX.writeFile(workbook, config.reportsFolderPath + nombreArc);
  	console.log("archivo escrito :)");

  	callback(null, nombreArc);
}

function listarUsuarios(callback){
	console.log("listar usuarios:");
	//para usar cuándo no está ejecutándose la aplicación
	//mongoose.connect(config.databaseURL);
	userModel.find({})
	.populate("role")
	.exec(function(err,users){
    	if(err) {
    		callback(err);
    		return;
    	}
		if(users){
			console.log(users.length+" users found!");
			var workbook = excelbuilder.createWorkbook(config.reportsFolderPath, 'usersList.xlsx');

			var sheet1 = workbook.createSheet('sheet1', 10, users.length+5);

			sheet1.align(1,1,'center');
			sheet1.font(1,1,{bold:'true'});
			sheet1.set(1,1,"Name");
			sheet1.align(2,1,'center');
			sheet1.font(2,1,{bold:'true'});
			sheet1.set(2,1,"User Name");
			sheet1.align(3,1,'center');
			sheet1.font(3,1,{bold:'true'});
			sheet1.set(3,1,"Role");
			sheet1.align(4,1,'center');
			sheet1.font(4,1,{bold:'true'});
			sheet1.set(4,1,"Is Admin");
			sheet1.align(5,1,'center');
			sheet1.font(5,1,{bold:'true'});
			sheet1.set(5,1,"Email");

			for(var i=0 ; i<users.length ; i++){
				sheet1.set(1,i+2,users[i].name);
				sheet1.set(2,i+2,users[i].username);
				sheet1.set(3,i+2,users[i].role.name);
				// if(users[i].isAdmin){
				// 	sheet1.set(4,i+2,"Yes");
				// } else {
				// 	sheet1.set(4,i+2,"No");
				// }
				sheet1.set(4,i+2,"-");
				sheet1.set(5,i+2,users[i].email);
			}

			workbook.save(function(ok){
				if (!ok){
					workbook.cancel();
				} else{
			      console.log('libro creado');
				}
			});

			callback(null, config.reportsFolderPath + 'usersList.xlsx');

		} else{
			console.log("no users found");
			callback("no users found", null);
		}
	});
}

function generatePhySummary(iniDate, endDate, phyName, daysOfWeek, callback) {

	generatePatientReportBetweenDates(iniDate, endDate, function (err, filename) {
		if(err) console.log(err);

		var outFile = config.reportsFolderPath + 'summary_' + moment().format("MM-DD-YY_HHmmss") + ".xlsm";
		var execCall = 'python ' + 
			config.phySummaryScriptPath + ' ' +
			config.reportsFolderPath + filename + ' ' +
			phyName.replace(' ', '\\ ') + ' ' +
			outFile;

		console.log(execCall);
		exec(execCall, function(error, stdout, stderr) {
			if (error) {
				return callback(error);
			}
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);

			// setTimeout(function () {
			callback(null, outFile);
			// }, 10000);
		});
	});
}



