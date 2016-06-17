//============================ Alert managment ==========================================

// orthopaedicsServices.factory('Alerts', ['$rootScope', function ($rootScope) {
//         var systemAlerts = [];

//         return {
//             addAlert: function (type, message) { 
//                 var newAlert = {type: type, msg: message};
//                 systemAlerts.push(newAlert);

//                 function autoCloseAlert (value) {
//                     setTimeout(function () {
//                         var index = systemAlerts.indexOf(value);
//                         if(index != -1) {
//                             systemAlerts.splice(index, 1);
//                             $rootScope.$broadcast('alerts:updated',systemAlerts);
//                         }
//                     }, 3000);
//                 }

//                 autoCloseAlert(newAlert);
//             },
//             closeAlert: function (index) {
//                 systemAlerts.splice(index, 1);
//             },
//             getAlerts: function () {
//                 return systemAlerts;
//             }
//         };
// }]);

//////////////////////////////////////////
////  API General
//////////////////////////////////////////

// orthopaedicsServices.factory('Messages', ['$resource',
//     function($resource){
//         return $resource('/api/messages/:messageId', {messageId: "@_id"}, {
//             sendMessage: {method: "POST"},
//             sendWelcomeMessage: {method: "POST", url: '/api/messages/welcome'},
//             sendBulkMessages: {method: "POST", url: '/api/messages/bulk'}
//         });
// }]);

orthopaedicsServices.factory('Emails', ['$resource',
    function($resource){
        return $resource('/api/emails/:emailId', {emailId: "@_id"}, {
            sendHelpMail: {method: "POST", url: '/api/emails/help'}
        });
}]);

orthopaedicsServices.factory('WaitTime',[function(){
    
    function getWRTime(patient) {

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

        if(patient.currentState == "NCI" || patient.currentState == "WR") return 0;

        var exDate = new Date(patient.EXTimestamp);
        var dcDate = new Date(patient.DCTimestamp);
        var nowDate = new Date();

        if(patient.currentState == "EX")
            return Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
        else 
            return Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));
    }

    function getTotalTime(patient){

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

    function getTimerColor(type, patient) {
        var nMins = 0;

        if(type == "WR") {
            if(patient.currentState == "NCI" || patient.currentState == "EX" || patient.currentState == "DC") 
                return "timer-not-started";
            nMins = getWRTime(patient);
        }
        else if(type == "EX") {
            if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "DC") 
                return "timer-not-started";
            nMins = getEXTime(patient);
        }
        else if(type == "WRH") {
            nMins = getWRTime(patient);
        }
        else if(type == "EXH") {
            nMins = getEXTime(patient);
        }

        if(nMins <= 15)
            return "timer-on-time";
        else if(nMins > 15 && nMins <= 30)
            return "timer-delay-15";
        else if(nMins > 30 && nMins <= 45)
            return "timer-delay-30";
        else if(nMins > 45)
            return "timer-delay-45";
    }

    return {
        getWRTime: getWRTime,
        getEXTime: getEXTime,
        getTotalTime: getTotalTime,
        getTimerColor: getTimerColor
    }
}]);

