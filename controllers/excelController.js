var XLSX 		 = require('xlsx');
var excelbuilder = require('msexcel-builder');
var _ 		 	 = require('underscore');

var patientController = require('../controllers/patientController');
var physicianController = require('../controllers/physicianController');
var userModel = require("../models/userModel")
var tools = require('../tools');
var config = require('../config');
var mongoose     = require('mongoose');

module.exports = {
	escribirExcel : escribirExcel
}

function escribirExcel (lowDate, highDate, callback) {
	var nombreArc = "";
	console.log("Generating report between " + lowDate + " and " + highDate);

    patientController.listPatientsBetweenDates(lowDate,highDate,function(err,patientList){
    	if(err) {
    		callback(err);
    		return;
    	}

    	console.log("Total patients: " + patientList.length);

    	//Load excel template
		var workbook = XLSX.readFile(config.reportTemplatePath, {cellStyles:true});
		var sheet_name_list = workbook.SheetNames;
		var worksheet = workbook.Sheets["Hoja1"];

		var range = {s: {c:0,r:0}, e:{c:12, r: patientList.length + 1}};
		worksheet['!ref'] = XLSX.utils.encode_range(range);

		var R = range.s.r + 1;

    	for(var i=0 ; i<patientList.length ; i++, ++R ){

    		var patient = patientList[i];
    		var name = patient.firstName?patient.firstName+" ":"";
    		name = patient.lastName?name+patient.lastName:name;
    		var physician = patient.physician?patient.physician.name:"";
    		//var apptDate = patient.apptTime;
    		var apptTime = patient.apptTime?(patient.apptTime.getMonth()+1)+"/"+patient.apptTime.getDate()+"/"+patient.apptTime.getFullYear()+" "+patient.apptTime.getHours()+":"+patient.apptTime.getMinutes()+":"+patient.apptTime.getSeconds():"";
			var wrTime = patient.WRTimestamp?patient.WRTimestamp.getHours()+":"+patient.WRTimestamp.getMinutes()+":"+patient.WRTimestamp.getSeconds():"";
			var exTime = patient.EXTimestamp?patient.EXTimestamp.getHours()+":"+patient.EXTimestamp.getMinutes()+":"+patient.EXTimestamp.getSeconds():"";
			//var fcDate = new Date(patient.fcStartedTimestamp);
			var fcStart = patient.fcStartedTimestamp?patient.fcStartedTimestamp.getHours()+":"+patient.fcStartedTimestamp.getMinutes()+":"+patient.fcStartedTimestamp.getSeconds():"";
			var fcEnd = patient.fcFinishedTimestamp?patient.fcFinishedTimestamp.getHours()+":"+patient.fcFinishedTimestamp.getMinutes()+":"+patient.fcFinishedTimestamp.getSeconds():"";
			var imaging = patient.imagingTimestamp ? patient.imagingTimestamp.getHours()+":"+patient.imagingTimestamp.getMinutes()+":"+patient.imagingTimestamp.getSeconds() : "";
			var dcTime = patient.DCTimestamp?patient.DCTimestamp.getHours()+":"+patient.DCTimestamp.getMinutes()+":"+patient.DCTimestamp.getSeconds():"";
			var wrTotalTime = tools.getWRTime(patient);
			var exTotalTime = tools.getEXTime(patient);
			var totalTime = tools.getTotalTime(patient);
			var atTotalTime = tools.getATtimer(patient);
			if(patient.fcStartedTimestamp && patient.fcFinishedTimestamp){
				Math.round((patient.fcFinishedTimestamp.getTime() - patient.fcStartedTimestamp.getTime()) / (60*1000));
			}

    		var data = [];

    		data.push({data:patient.medicalRecordNumber, tipo: "s"});
    		data.push({data:name, tipo: "s"});
    		data.push({data:physician, tipo: "s"});
    		data.push({data:apptTime, tipo: "s"});
    		data.push({data:wrTime, tipo: "s"});
    		data.push({data:exTime, tipo: "s"});
    		data.push({data:fcStart, tipo: "s"});
    		data.push({data:fcEnd, tipo: "s"});
    		data.push({data: !!patient.imagingRequestedTimestamp, tipo: "b"});
    		data.push({data: imaging, tipo: "s"});
    		data.push({data:dcTime, tipo: "s"});
    		data.push({data:wrTotalTime, tipo: "s"});
    		data.push({data:exTotalTime, tipo: "s"});
    		data.push({data:totalTime, tipo: "s"});
    		data.push({data:atTotalTime, tipo: "s"});

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
		nombreArc = 'report' + dateReport.getFullYear()+'_'+month+'_'+dateReport.getDate()+
	  		'_'+dateReport.getHours()+dateReport.getMinutes()+dateReport.getSeconds()+'.xlsx';
	  	XLSX.writeFile(workbook, config.reportsFolderPath + nombreArc);
	  	console.log("archivo escrito :)");

	  	callback(null, nombreArc);
    });

	// return nombreArc;
}

function listarUsuarios(){
	console.log("listar usuarios:");
	//para usar cuándo no está ejecutándose la aplicación
	//mongoose.connect(config.databaseURL);
	userModel.find({},function(err,users){
		if(users){
			console.log(users.length+" users found!");
			var workbook = excelbuilder.createWorkbook('./', 'usersList.xlsx');

			var sheet1 = workbook.createSheet('sheet1', 10, users.length+5);

			sheet1.align(1,1,'center');
			sheet1.font(1,1,{bold:'true'});
			sheet1.set(1,1,"Name");
			sheet1.align(2,1,'center');
			sheet1.font(2,1,{bold:'true'});
			sheet1.set(2,1,"User Name");
			sheet1.align(3,1,'center');
			sheet1.font(3,1,{bold:'true'});
			sheet1.set(3,1,"Password");
			sheet1.align(4,1,'center');
			sheet1.font(4,1,{bold:'true'});
			sheet1.set(4,1,"Role");
			sheet1.align(5,1,'center');
			sheet1.font(5,1,{bold:'true'});
			sheet1.set(5,1,"Is Admin");

			for(var i=0 ; i<users.length ; i++){
				sheet1.set(1,i+2,users[i].name);
				sheet1.set(2,i+2,users[i].username);
				sheet1.set(3,i+2,users[i].password);
				sheet1.set(4,i+2,users[i].role);
				if(users[i].isAdmin){
					sheet1.set(5,i+2,"Yes");
				} else{
					sheet1.set(5,i+2,"No");
				}
			}

			workbook.save(function(ok){
				if (!ok){
					workbook.cancel();
				} else{
			      console.log('libro creado');
				}
			});

		} else{
			console.log("no users found");
		}
	});

}


//esto es solo para pruebas, se debe borrar al final

// var lowDate = new Date();
// var highDate = new Date();

// escribirExcel(lowDate,highDate);

//para probar listarUsuarios: 

//listarUsuarios();