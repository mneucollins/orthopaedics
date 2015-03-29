var CronJob = require('cron').CronJob;
var reader = require('./excelReader');
new CronJob('00 55 10 * * *', function() {
	reader.leerExcel();
  console.log('Excel readed successfuly :P');
}, null, true, 'America/Detroit');