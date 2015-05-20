var CronJob = require('cron').CronJob;
var reader = require('./excelReader');

new CronJob('00 45 23 * * *', function() {
// new CronJob('* * * * * *', function() { // test 
	reader.leerExcel();
  	console.log('Excel readed successfuly :P');
}, null, true, 'America/Detroit');