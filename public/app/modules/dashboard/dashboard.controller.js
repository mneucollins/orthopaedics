
angular.module('dashboardModule')
.controller('dashboardCtrl', ['$scope', '$location', '$rootScope', '$log', '$interval', '$timeout', '$modal', 'Patient', 'Messages', 'Physician', 'WaitTime', 'AuthService',
  function($scope, $location, $rootScope, $log, $interval, $timeout, $modal, Patient, Messages, Physician, WaitTime, AuthService) {

    $("nav").removeClass("hidden");
    $("body").removeClass("body-login");
    $scope.currentTime = new Date();

    $interval(function minuteUpdate () {
        $scope.currentTime = new Date();
    }, 500);




    // Physician managment
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $rootScope.$watch("selectedPhysicians", function (newValue, oldValue) {
        retrievePatients(newValue);
        retrieveClinicDelays();
    });

    $scope.getPhysicianTime = function (physician) {

        // Discharged and not checked in patients are dismissed
        var searchList = _.filter($scope.patientList, function (patient) {
            return patient.physician._id == physician._id && 
                    patient.WRTimestamp && !patient.DCTimestamp
                    && !patient.isDeleted; // &&
                    // new Date(patient.WRTimestamp).getTime() <= new Date(patient.apptTime).setMinutes + (10*60*1000);
        });
        //WR patients are separated from EX patients
        searchList = _.groupBy(searchList, function (patient) { return patient.currentState; })
        if(!searchList.WR) searchList.WR = [];

        if(searchList.EX){
            // gets que last called back patient
            var lastEXCalled = _.max(searchList.EX, function (patient) { return new Date(patient.EXTimestamp).getTime(); });
            // final list contains all WR patient + last called back patient
            searchList.WR.push(lastEXCalled);
        }
        searchList = searchList.WR;

        if(searchList.length <= 0) return 0;

        var wrTime = _.max(searchList, function (item) {
            return WaitTime.getWRTime(item);
        });
        physician.time = WaitTime.getWRTime(wrTime);
        return physician.time > 0 ? physician.time : 0;
    }

    $scope.$on('onPatientListed', function(scope, element, attrs){
        var role = AuthService.currentUser().role;
        $scope.hidePhysicians = $rootScope.selectedPhysicians.length == 1 && role == "Physician";
    });

    function retrieveClinicDelays () {  
        var physicianIds = _.map($rootScope.selectedPhysicians, function (phy) {
            return phy._id;
        });
        Physician.getClinicDelays({phyList: physicianIds}, function (delays) {
            _.each($rootScope.selectedPhysicians, function (element, index, list) {
                element.clinicDelay = delays[element._id] ? delays[element._id] : 0;
            });
        });
    }

    $interval(retrieveClinicDelays, 5 * 60 * 1000);

    // Sync
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var socket;
    initSocket();

    $interval(function checksocketConnection () {  
        if(!socket.connected) {
            $log.log("socket is disconnected! reconecting...");
            initSocket();
        }

    }, 60000);

    function initSocket () {
        socket = io.connect($location.protocol() + '://' + $location.host() + ":" + $location.port());
        
        socket.on('syncPatient', function (updPatient) {

            function loadExistingPatient (updPatient, recurrent) {  
                var listPatient = _.find($scope.patientList, function(patient){ 
                    return patient.id == updPatient.id; 
                });

                if(listPatient) {
                    var index = $scope.patientList.indexOf(listPatient);
                    updPatient.physician = $scope.patientList[index].physician;
                    $scope.patientList[index] = updPatient; 
                    $scope.$apply();
                    return true;
                }
                else {
                    if(recurrent) setTimeout(function () {
                        loadNewPatient(updPatient);
                    }, 500);
                    return false;
                }
            }

            function loadNewPatient (updPatient) {  

                if(!loadExistingPatient (updPatient, false)) {
                    var physicianPatient = _.find($scope.patientList, function(patient){ 
                        return patient.physician.id == updPatient.physician; 
                    });

                    if(physicianPatient){
                        updPatient.physician = physicianPatient.physician;
                        $scope.patientList.push(updPatient);
                        $scope.filteringActive($scope.colFilter);
                        $scope.filteringActive($scope.colFilter);
                        $scope.$apply();
                    }
                }
            }  

            loadExistingPatient (updPatient, true);
        });
        socket.on('greetings', function (greet) {
            $log.log(JSON.stringify(greet));
        });

        $log.log("socket is ready!");
    }

    function retrievePatients () {
        $scope.patientList = [];
        var physicians = $scope.selectedPhysicians;

        for (var i = 0; i < physicians.length; i++) {
            var physician = physicians[i];

            Physician.getPatientsToday({physicianId: physician._id}, function (patients) {
                var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getTime(); });  // sort by appt time (hours)
                _.each(pList, function (element, index, list) {
                    list[index].messageSelectorPos = 1;
                });
                $scope.patientList = $scope.patientList.concat(pList);
                pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getTime(); }); 
                $scope.patientList = pList;
                $rootScope.patientList = pList;

                //alert('col:' + $scope.colFilter);
                $scope.filteringActive($scope.colFilter, 0);
            });
        };
    }

    $rootScope.syncPatients = retrievePatients;
    $interval(retrievePatients, 3 * 60 * 1000);

    // Filters & sorting
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    //Filtering function styles.
    //Start ordering by ApptTime, column 1";
    $scope.arrowDirection = 0;
    $scope.colFilter  = 1;

    $scope.filteringActive = function (idLauncher, changeArrow){
        $scope.colFilter = idLauncher;
        var pList;

        switch(idLauncher) {
            case 1:
                pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getTime(); }); 
                break;
            case 2:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.fullName; });
                break;
            case 2.1:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.apptType; });
                break;
            case 3:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.physician.name; }); 
                break;
            case 3:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.roomNumber; }); 
                break;
            case 4:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.dateBirth; });
                break;
            case 4.1:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            var counter = 0;
                            for (var i = 0; i < patient.enterTimestamp.length; i++) {
                                if(patient.exitTimestamp[i])
                                    counter += (new Date(patient.exitTimestamp[i])).getTime() - 
                                                    (new Date(patient.enterTimestamp[i])).getTime();
                                else
                                    counter += (new Date()).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
                            }
                            return new Date(counter);
                        });
                break;
            case 4.2:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.age; });
                break;
            case 5:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            if(patient.needsImaging)
                                if(patient.imagingTimestamp)
                                    return 3;   
                                else
                                    return 2;
                            else
                                return 1;   
                        }); 
                break;
            case 5.1:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            if(!patient.fcStartedTimestamp)
                                return 1;   
                            else if(!patient.fcFinishedTimestamp)
                                return 2; 
                            else 
                                return 3;
                        }); 
                break;
            case 6:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            var wrt = WaitTime.getWRTime(patient);
                            var ext = WaitTime.getEXTime(patient);
                            return wrt + ext; 
                        }); 
                break;
            case 7:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            return WaitTime.getTotalTime(patient); 
                        }); 
                break;
        }

        if($scope.arrowDirection == 1 && changeArrow != 0  ){
            $scope.patientList = pList;
            $scope.arrowDirection = 0;
        }
        else if ( ($scope.arrowDirection == 0 && changeArrow != 0)  || ($scope.arrowDirection == 1 && changeArrow == 0  )){
            $scope.patientList = pList.reverse();
            $scope.arrowDirection = 1;
        }
        else{
            $scope.patientList = pList;
            $scope.arrowDirection = 0;
        }
    }

    // Messages Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.sendImagingMessage = function (patient) {

        if(!patient.noPhone) {
            var modalInstance = $modal.open({
                templateUrl: '/app/modules/messages/send-message.dialog.html',
                controller: 'sendMessageCtrl',
                resolve: {
                    patient: function () {
                        return patient;
                    },
                    messageType: function () {
                        return "IM";
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Imaging message sent!');
            }, function () {
                $log.info('Message Modal dismissed at: ' + new Date());
            });  
        }
    }


    // Times calculation
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // $rootScope.getWRTime = function (patient) {

    //     if(patient.currentState == "NCI") return 0;

    //     var wrDate = new Date(patient.WRTimestamp).getTime();
    //     var apptDate = new Date(patient.apptTime).getTime();
    //     var exDate = new Date(patient.EXTimestamp).getTime();
    //     var fcIniDate = new Date(patient.fcStartedTimestamp).getTime();
    //     var fcFinDate = new Date(patient.fcFinishedTimestamp).getTime();
    //     var nowDate = new Date().getTime();

    //     var isLate = apptDate < wrDate;
    //     var wrTime = 0;

    //     if(patient.currentState == "WR") {
    //         if(isLate) // patient arrived late
    //             wrTime = nowDate - wrDate;
    //         else // patient arrived in time
    //             wrTime = nowDate - apptDate;
            
    //         if(patient.fcFinishedTimestamp) { // finished FC
    //             if(apptDate <= fcFinDate)
    //                 wrTime = nowDate - fcFinDate;
    //             else if(apptDate < fcIniDate)
    //                 wrTime = wrTime - patient.fcDuration;
    //         }
    //         else if(patient.fcStartedTimestamp) { // in FC
    //             if(apptDate < nowDate)
    //                 wrTime = 0;
    //             else if(apptDate < fcIniDate)
    //                 if(isLate)
    //                     wrTime = fcIniDate - wrDate;
    //                 else
    //                     wrTime = fcIniDate - apptDate; 
    //         }  
    //     }
    //     else {
    //         if(isLate)
    //             wrTime = exDate - wrDate;
    //         else
    //             wrTime = exDate - apptDate;

    //         if(patient.fcDuration) // finished FC
    //             if(apptDate <= fcFinDate)
    //                 wrTime = exDate - fcFinDate;
    //             else if(apptDate < fcIniDate)
    //                 wrTime = wrTime - patient.fcDuration;
    //     }
        
    //     return Math.round(wrTime / (60*1000));
    // }

    // $rootScope.getEXTime = function (patient) {

    //     if(patient.currentState == "NCI" || patient.currentState == "WR") return 0;

    //     var exDate = new Date(patient.EXTimestamp);
    //     var dcDate = new Date(patient.DCTimestamp);
    //     var nowDate = new Date();

    //     if(patient.currentState == "EX")
    //         return Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
    //     else 
    //         return Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));
    // }    

    // $rootScope.getTotalTime = function (patient){

    //     if(patient.currentState == "NCI") return 0;  

    //     var wrDate = new Date(patient.WRTimestamp);
    //     var apptDate = new Date(patient.apptTime);
    //     var dcDate = new Date(patient.DCTimestamp);
    //     var nowDate = new Date();
    //     var totalTime = 0;

    //     if(patient.currentState == "EX" || patient.currentState == "WR")
    //         totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
    //     else 
    //         totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));

    //     return totalTime > 0 ? totalTime : 0;
    // }

    // $rootScope.getTimerColor = function (type, patient) {
    //     var nMins = 0;

    //     if(type == "WR") {
    //         if(patient.currentState == "NCI" || patient.currentState == "EX" || patient.currentState == "DC") 
    //             return "timer-not-started";
    //         nMins = $scope.getWRTime(patient);
    //     }
    //     else if(type == "EX") {
    //         if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "DC") 
    //             return "timer-not-started";
    //         nMins = $scope.getEXTime(patient);
    //     }
    //     else if(type == "WRH") {
    //         nMins = $scope.getWRTime(patient);
    //     }
    //     else if(type == "EXH") {
    //         nMins = $scope.getEXTime(patient);
    //     }

    //     if(nMins <= 15)
    //         return "timer-on-time";
    //     else if(nMins > 15 && nMins <= 30)
    //         return "timer-delay-15";
    //     else if(nMins > 30 && nMins <= 45)
    //         return "timer-delay-30";
    //     else if(nMins > 45)
    //         return "timer-delay-45";
    // }











    $rootScope.tooglePhysiciansList = function () {
        $rootScope.hidePhysiciansList = !$rootScope.hidePhysiciansList;
    }
    
    $timeout(resizePhybar, 300); // método en el main.js
    $rootScope.selectedPhysicians = [];
    $rootScope.hidePhysiciansList = false;

    Physician.query(function (physicians) {
        _.each(physicians, function (element, index, list) {
            list[index].selected = false;
        });
        $scope.physicianList = physicians;
    });

}]);