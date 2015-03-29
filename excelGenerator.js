var XLSX 		 = require('xlsx');
var _ 		 	 = require('underscore');
var mongoose     = require('mongoose');
var patientController = require('./controllers/patientController');
var patientModel = require('./models/patientModel');
var userModel = require('./models/userModel');


function escribirExcel (lowDate,highDate) {

var nombreArc = "";

	console.log("hakuna matata - The report starts to work");
	mongoose.connect('mongodb://localhost:27017/orthopaedics');

    patientController.listPatientsBetweenDates(lowDate,highDate,function(err,patientList){
    	if(err)
    		return console.error(err);

    	console.log("Total de pacientes: "+patientList.length);

    	//Load excel template
		var workbook = XLSX.readFile('./reports/report_template.xlsx', {cellStyles:true});
		var sheet_name_list = workbook.SheetNames;
		var worksheet = workbook.Sheets["Hoja1"];

		var range = {s: {c:0,r:0}, e:{c:5, r: patientList.length + 1}};
		worksheet['!ref'] = XLSX.utils.encode_range(range);

		var R = range.s.r + 1;

    	//_.each(patientList, function(patient,i,list){

    	for(var i=0 ; i<patientList.length ; i++, ++R ){


    		var patient = patientList[i];
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

		        


        	//TotalTime
			if(patient.currentState != "NCI")
		        if(patient.currentState == "EX" || patient.currentState == "WR")
		            totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
		        else 
		            totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));

	        totalTime = totalTime > 0 ? totalTime : 0;


    		var data = [];
    		data.push({data:patient.medicalRecordNumber, tipo: "s"});
    		data.push({data:patient.apptTime, tipo: "d"});
    		data.push({data:patient.needsImaging, tipo: "b"});
    		data.push({data:wrTime, tipo: "n"});
    		data.push({data:exTime, tipo: "n"});
    		data.push({data:totalTime, tipo: "n"});

			for(var C = 0; C < data.length; C++) {
				var cellAddr = XLSX.utils.encode_cell({c:C, r:R});
				var cellData = {
					t: data[C].tipo, 
					v: data[C].data
				};

				worksheet[cellAddr] = cellData;
			}
		}
    	//});
		
		var dateReport = new Date();
		var month = Math.round(dateReport.getMonth()+1);
		nombreArc = 'report'+dateReport.getFullYear()+'_'+month+'_'+dateReport.getDate()+
	  		'_'+dateReport.getHours()+dateReport.getMinutes()+dateReport.getSeconds()+'.xlsx';
	  	XLSX.writeFile(workbook, './reports/'+nombreArc);
	  	console.log("archivo escrito :)");

    });

return nombreArc;

}


//esto es solo para pruebas, se debe borrar al final

var lowDate = new Date();
var highDate = new Date();

escribirExcel(lowDate,highDate);


