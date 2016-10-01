
orthopaedicsServices.factory('Emails', ['$resource',
    function($resource){
        return $resource('/api/emails/:emailId', {emailId: "@_id"}, {
            sendHelpMail: {method: "POST", url: '/api/emails/help'}
        });
}]);

orthopaedicsServices.factory('WaitTime', ["Config", function(Config){
    
    function getWRTime(patient) {

        if(patient.currentState == "NCI" || patient.currentState == "PR") 
            return 0;

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
            
            if(patient.fcFinishedTimestamp) { // finished FC
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

    function getEXTime(patient) {

        if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "PR") 
            return 0;

        var exDate = new Date(patient.EXTimestamp);
        var dcDate = new Date(patient.DCTimestamp);
        var nowDate = new Date();

        if(patient.currentState == "EX")
            return Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
        else 
            return Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));
    }

    function getTotalTime(patient){

        if(patient.currentState == "NCI") 
            return 0;  

        var prDate = patient.PRTimestamp ? new Date(patient.PRTimestamp) : false;
        var wrDate = new Date(patient.WRTimestamp);
        var apptDate = new Date(patient.apptTime);
        var dcDate = new Date(patient.DCTimestamp);
        var nowDate = new Date();
        var totalTime = 0;

        var countTime = prDate ? prDate : wrDate ;

        if(patient.currentState == "EX" || patient.currentState == "WR" || patient.currentState == "PR")
            totalTime = Math.round((nowDate.getTime() - countTime.getTime()) / (60*1000));
        else 
            totalTime = Math.round((dcDate.getTime() - countTime.getTime()) / (60*1000));

        return totalTime > 0 ? totalTime : 0;
    }

    function getTimerColor(type, patient) {
        var nMins = 0;

        if(type == "WR") {
            if(patient.currentState == "NCI" || patient.currentState == "EX" || patient.currentState == "DC" || patient.currentState == "PR") 
                return "timer-not-started";
            nMins = getWRTime(patient);
        }
        else if(type == "EX") {
            if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "DC" || patient.currentState == "PR") 
                return "timer-not-started";
            nMins = getEXTime(patient);
        }
        else if(type == "WRH") {
            nMins = getWRTime(patient);
        }
        else if(type == "EXH") {
            nMins = getEXTime(patient);
        }

        if(nMins <= Config.getLongWaitMinutes())
            return "timer-on-time";
        else if(nMins > Config.getLongWaitMinutes() && nMins <= Config.getWarnWaitMinutes())
            return "timer-delay-15";
        else if(nMins > Config.getWarnWaitMinutes() && nMins <= Config.getDangerWaitMinutes())
            return "timer-delay-30";
        else if(nMins > Config.getDangerWaitMinutes())
            return "timer-delay-45";
    }

    return {
        getWRTime: getWRTime,
        getEXTime: getEXTime,
        getTotalTime: getTotalTime,
        getTimerColor: getTimerColor
    }
}]);

