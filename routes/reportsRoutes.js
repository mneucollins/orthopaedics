module.exports = function (router) {

    var tools = require('../tools');
    var config = require('../config');
    var fs = require('fs');
    var path = require('path');
    var mime = require('mime');


    var excelController = require('../controllers/excelController');

    router.route('/reports/generate')
    .get(function(req, res) { 

        var reportParams = req.params;

        excelController.escribirExcel(req.param("iniDate"), req.param("endDate"),
        function (err, data) {
            if(err) {
                tools.sendServerError(err, req, res);
                return;
            }

            var file = config.reportsFolderPath + data;
            res.download(file);
            // var filename = path.basename(file);
            // var mimetype = mime.lookup(file);

            // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            // res.setHeader('Content-type', mimetype);

            // var filestream = fs.createReadStream(file);
            // filestream.pipe(res);
            console.log("report sent!");
        });
    });
}
