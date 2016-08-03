
angular.module('dashboardModule')
.controller('dashboardCtrl', ['$scope', '$location', '$rootScope', '$log', '$interval', '$timeout', '$modal', 'Patient', 'Messages', 'Physician', 'WaitTime', 'AuthService', 'LayoutService', 'DashboardService',
  function($scope, $location, $rootScope, $log, $interval, $timeout, $modal, Patient, Messages, Physician, WaitTime, AuthService, LayoutService, DashboardService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

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
        DashboardService.retrieveClinicDelays();
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
        $scope.layout = LayoutService.getLayoutUser();
        $scope.titles=[];
        $scope.titles = LayoutService.getActiveColumns();
        // for(var directive in $scope.layout.columns){
        //     $scope.titles.push(LayoutService.getTitleName($scope.layout.columns[directive]));
        // }
    });

    // $scope.retrieveClinicDelays = function() {
    //     var physicianIds = _.map($rootScope.selectedPhysicians, function (phy) {
    //         return phy._id;
    //     });
    //     Physician.getClinicDelays({phyList: physicianIds}, function (delays) {
    //         _.each($rootScope.selectedPhysicians, function (element, index, list) {
    //             element.clinicDelay = delays[element._id] ? delays[element._id] : 0;
    //         });
    //     });
    // }

    $interval(DashboardService.retrieveClinicDelays, 5 * 60 * 1000);

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
        $scope.highlightNewPatients = LayoutService.highlightNewPatients();
        $scope.patientList = [];
        var physicians = $scope.selectedPhysicians;

        for (var i = 0; i < physicians.length; i++) {
            var physician = physicians[i];

            Physician.getPatientsToday({physicianId: physician._id}, function (patients) {
                var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getTime(); });  // sort by appt time (hours)
                _.each(pList, function (element, index, list) {
                    list[index].messageSelectorPos = 1;
                    // Patient.getHistory({patientId: list[index].id}, function (history) {
                    //     if (history && history.length > 0){
                    //         list[index].history = history;
                    //         list[index].previousDate = history[0];
                    //     }
                    // });
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
    $scope.colFilter  = "appt-time-column";

    $scope.filteringActive = function (idLauncher, changeArrow){
        $scope.colFilter = idLauncher;
        var pList;

        switch(idLauncher) {
            case "appt-time-column":
                pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getTime(); }); 
                break;
            case "name-column":
                pList = _.sortBy($scope.patientList, function(patient){ return patient.fullName; });
                break;
            case "appt-type-column":
                pList = _.sortBy($scope.patientList, function(patient){ return patient.apptType; });
                break;
            case "physician-column":
                pList = _.sortBy($scope.patientList, function(patient){ return patient.physician.name; }); 
                break;
            case "room-number-column":
                pList = _.sortBy($scope.patientList, function(patient){ return patient.roomNumber; }); 
                break;
            case 4:
                pList = _.sortBy($scope.patientList, function(patient){ return patient.dateBirth; });
                break;
            case "at-column":
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
            case "age-column":
                pList = _.sortBy($scope.patientList, function(patient){ return patient.age; });
                break;
            case "fp-column":
                pList = _.sortBy($scope.patientList, function(patient){ 
                            var counter = 0;
                            for (var i = 0; i < patient.fpTimerEnterTimestamp.length; i++) {
                                if(patient.fpTimerExitTimestamp[i])
                                    counter += (new Date(patient.fpTimerExitTimestamp[i])).getTime() - 
                                                    (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
                                else
                                    counter += (new Date()).getTime() - (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
                            }
                            return new Date(counter);
                        });
                break;
            case "imaging-column":
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
            case "fc-column":
                pList = _.sortBy($scope.patientList, function(patient){ 
                            if(!patient.fcStartedTimestamp)
                                return 1;   
                            else if(!patient.fcFinishedTimestamp)
                                return 2; 
                            else 
                                return 3;
                        }); 
                break;
            case "labs-column":
                pList = _.sortBy($scope.patientList, function(patient){ 
                            if(patient.needsLabs)
                                if(patient.labsTimestamp)
                                    return 3;   
                                else
                                    return 2;
                            else
                                return 1;   
                        }); 
                break;
            case "wait-status-column":
                pList = _.sortBy($scope.patientList, function(patient){ 
                            var wrt = WaitTime.getWRTime(patient);
                            var ext = WaitTime.getEXTime(patient);
                            return wrt + ext; 
                        }); 
                break;
            case "wait-total-column":
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