var CronJob = require('cron').CronJob;
var reader = require('./excelReader');
var spawn = require('child_process').spawn;

var config = require("./config");


// Try bringind the HL7 file for the first time
new CronJob('00 00 20 * * *', function() {

	var excelRetrievalJob = spawn('sh', [config.excelFeedScriptPath]);

	excelRetrievalJob.stdout.pipe(process.stdout, { end: false });
	excelRetrievalJob.stderr.pipe(process.stderr, { end: false });

    excelRetrievalJob.on("exit", function () {
  		console.log('Excel brought successfuly ^_^');
    });
}, null, true, 'America/Detroit');

// Try bringind the HL7 file for the second time time, in case first failed
new CronJob('00 15 20 * * *', function() {

	var excelRetrievalJob = spawn('sh', [config.excelFeedScriptPath]);

	excelRetrievalJob.stdout.pipe(process.stdout, { end: false });
	excelRetrievalJob.stderr.pipe(process.stderr, { end: false });

    excelRetrievalJob.on("exit", function () {
  		console.log('Excel brought successfuly ^_^');
    });
}, null, true, 'America/Detroit');


// Reading the feed
new CronJob('00 20 20 * * *', function() {
// new CronJob('* * * * * *', function() { // test 

	reader.leerExcel();
  	console.log('Excel readed successfuly :P');
}, null, true, 'America/Detroit');