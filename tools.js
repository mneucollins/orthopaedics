var _ = require("underscore");

module.exports = {
	sendServerError: sendServerError,
	sendUnauthorized: sendUnauthorized,
	isLoggedIn: isLoggedIn,
	isAdmin: isAdmin,
	getWRTime: getWRTime,
	getEXTime: getEXTime,
	getTotalTime: getTotalTime
}

function sendServerError(err, req, res) {
  console.log("Error en sendServerError");
  console.log(err);
  res.set('Content-Type', 'text/plain');
  res.sendStatus(500);
}

function sendUnauthorized(req, res) {
  console.log("Acceso no autorizado al API");
  res.set('Content-Type', 'text/plain');
  res.sendStatus(401);
}

function isLoggedIn (req, res, next) {

	if (req.isAuthenticated()) {
		if(next) next();
		return true;
	}
	else {
		res.sendStatus(401);
		return false;
	}
}

function isAdmin (req, res, next) {

	if (req.isAuthenticated()) {
		if(_.contains(req.user.roles, "admin")) {
			if(next) next();
			return true;
		}
		else {
			res.sendStatus(401);
			return false;
		}
	}
	else {
		res.sendStatus(401);
		return false;
	}
}

function getWRTime (patient) {

    if(patient.currentState == "NCI") return 0;

    var wrDate = new Date(patient.WRTimestamp).getTime();
    var apptDate = new Date(patient.apptTime).getTime();
    var exDate = new Date(patient.EXTimestamp).getTime();
    var fcIniDate = new Date(patient.fcStartedTimestamp).getTime();
    var fcFinDate = new Date(patient.fcFinishedTimestamp).getTime();
    var nowDate = new Date().getTime();

    var isLate = apptDate < wrDate;
    var wrTime = 0;

    if(patient.currentState == "WR") {
        if(isLate) // patient arrived late
            wrTime = nowDate - wrDate;
        else // patient arrived in time
            wrTime = nowDate - apptDate;
        
        if(patient.fcDuration) { // finished FC
            if(apptDate <= fcFinDate)
                wrTime = nowDate - fcFinDate;
            else if(apptDate < fcIniDate)
                wrTime = wrTime - patient.fcDuration;
        }
        else if(patient.fcStartedTimestamp) { // in FC
            if(apptDate < nowDate)
                wrTime = 0;
            else if(apptDate < fcIniDate)
                if(isLate)
                    wrTime = fcIniDate - wrDate;
                else
                    wrTime = fcIniDate - apptDate; 
        }  
    }
    else {
        if(isLate)
            wrTime = exDate - wrDate;
        else
            wrTime = exDate - apptDate;

        if(patient.fcDuration) // finished FC
            if(apptDate <= fcFinDate)
                wrTime = exDate - fcFinDate;
            else if(apptDate < fcIniDate)
                wrTime = wrTime - patient.fcDuration;
    }
    
    return Math.round(wrTime / (60*1000));
}

function getEXTime (patient) {

    if(patient.currentState == "NCI" || patient.currentState == "WR") return 0;

    var exDate = new Date(patient.EXTimestamp);
    var dcDate = new Date(patient.DCTimestamp);
    var nowDate = new Date();

    if(patient.currentState == "EX")
        return Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
    else 
        return Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));
}    

function getTotalTime (patient){

    if(patient.currentState == "NCI") return 0;  

    var wrDate = new Date(patient.WRTimestamp);
    var apptDate = new Date(patient.apptTime);
    var dcDate = new Date(patient.DCTimestamp);
    var nowDate = new Date();
    var totalTime = 0;

    if(patient.currentState == "EX" || patient.currentState == "WR")
        totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
    else 
        totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));

    return totalTime > 0 ? totalTime : 0;
}

function getATtimer (patient) {

        var counter = 0;
        for (var i = 0; i < patient.enterTimestamp.length; i++) {
            if(patient.exitTimestamp[i])
                counter += (new Date(patient.exitTimestamp[i])).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
            else
                counter += (new Date()).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
        };

        return new Date(counter);
    }