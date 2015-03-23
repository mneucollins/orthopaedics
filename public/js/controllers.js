var orthopaedicsControllers = angular.module('orthopaedicsControllers', ['ui.bootstrap']);

// =======================================================
// ========================= HEADER ==================
// =======================================================

    orthopaedicsControllers.controller('headerCtrl', ['$scope', '$location', '$interval', 'AuthService',
        function($scope, $location, $interval, AuthService){
            
            $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
                $scope.isLoggedIn = isLoggedIn;
                $scope.currentUser = AuthService.currentUser();
            });

            $scope.logout = function () {
                AuthService.logout(function () {
                    $location.path("/login");            
                });
            }

            $interval(function () {
                var url = $location.path();

                if(url.indexOf("dashboard1") != -1){
                    $scope.dashboard = "1";
                    if($scope.currentUser.role == "Physician" || $scope.currentUser.role == "FirstProvider")
                        $location.url("/dashboard2");
                } 
                else if(url.indexOf("dashboard2") != -1) {
                    $scope.dashboard = "2";
                    if($scope.currentUser.role == "Imaging" || $scope.currentUser.role == "Receptionist") 
                        $location.url("/dashboard1");
                }
            }, 1000);
    }]);

    orthopaedicsControllers.controller('AlertsCtrl', ['$scope', 'Alerts',
        function ($scope, Alerts) {

            $scope.systemAlerts = Alerts.getAlerts();

            $scope.$on('alerts:updated', function (event, alerts) {
                $scope.systemAlerts = alerts;
                $scope.$apply();
            });

            $scope.closeAlert = function(index) {
                Alerts.closeAlert(index);
            };
    }]);

// =====================================================================================
// ================================ NAVEGACION =========================================
// =====================================================================================

// =============================== LOGIN CTRL ===================================

orthopaedicsControllers.controller('loginCtrl', ['$scope', '$location', 'AuthService', 'Alerts',
	function($scope, $location, AuthService, Alerts) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");

    $scope.login = function () {
        AuthService.login($scope.user, function(user) {
            Alerts.addAlert("success", "Welcome " + user.name);

            if(user.role == "Imaging" || user.role == "Receptionist")
                $location.path("/dashboard1");
            else
                $location.path("/dashboard2");

        }, function (err) {
            Alerts.addAlert("error", "ups! we got an error: " + JSON.stringify(err));
        });
    };
}]);

// =============================== SCHEDULE CTRL ===================================

orthopaedicsControllers.controller('scheduleCtrl', ['$scope', '$location', '$rootScope', '$log', '$interval', '$modal', 'Patient', 'Messages', 'Physician',
  function($scope, $location, $rootScope, $log, $interval, $modal, Patient, Messages, Physician) {

    $("nav").removeClass("hidden");
    $("body").removeClass("body-login");
    $scope.currentTime = new Date();

    $interval(function minuteUpdate () {
        $scope.currentTime = new Date();
    }, 500);

    // Physician managment
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $rootScope.$watch("selectedPhysicians", function (newValue, oldValue) {
        $scope.patientList = [];
        for (var i = 0; i < newValue.length; i++) {
            var physician = newValue[i];

            Physician.getPatientsToday({physicianId: physician._id}, function (patients) {
                var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getTime(); });  // sort by appt time (hours)
                _.each(pList, function (element, index, list) {
                    list[index].messageSelectorPos = 1;
                });
                $scope.patientList = $scope.patientList.concat(pList);
            });
        };
    });

    $scope.getPhysicianTime = function (physician) {
        var searchList = _.sortBy($scope.patientList, function(patient){ return patient.apptTime });
        searchList = _.filter(searchList, function (patient) {
            return patient.physician._id == physician._id && 
                    patient.WRTimestamp && !patient.DCTimestamp; // &&
                    // new Date(patient.WRTimestamp).getTime() <= new Date(patient.apptTime).setMinutes + (10*60*1000);
        });

        if(searchList.length <= 0) return 0;

        // var wrTime = $scope.getWRTime(searchList[0]);
        // var exTime = $scope.getEXTime(searchList[0]);
        // physician.time = wrTime > exTime ? wrTime : exTime;
        var wrTime = _.max(searchList, function (item) {
            return $scope.getWRTime(item);
        });
        physician.time = $scope.getWRTime(wrTime);
        return physician.time > 0 ? physician.time : 0;
    }

    // Sync
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var socket = io.connect($location.protocol() + '://' + $location.host() + ":" + $location.port());
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
                    $scope.$apply();
                }
            }
        }  

        loadExistingPatient (updPatient, true);
    });
    socket.on('greetings', function (greet) {
        console.log(JSON.stringify(greet));
    });

    // Filters & sorting
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    //Filtering function styles.
    //Start ordering by ApptTime, column 1";
    $scope.arrowDirection = 1;
    $scope.colFilter  = 1;
    $scope.filteringActive = function (idLauncher){
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
            case 6:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            var wrt = $scope.getWRTime(patient);
                            var ext = $scope.getEXTime(patient);
                            return wrt + ext; 
                        }); 
                break;
            case 7:
                pList = _.sortBy($scope.patientList, function(patient){ 
                            return $scope.getTotalTime(patient); 
                        }); 
                break;
        }

        if($scope.arrowDirection == 1){
            $scope.patientList = pList.reverse();
            $scope.arrowDirection = 0;
        }
        else{
            $scope.patientList = pList;
            $scope.arrowDirection = 1;
        }
    }

    // Patient History
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.loadPatientHistory = function (patient) {
      Patient.getHistory({patientId: patient.id}, function (history) {
          patient.history = history;
      })
    }

    // Attending Entry Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.toogleATEntry = function (patient) {
        if(patient.currentState != 'EX') return;

        if(patient.enterTimestamp.length > patient.exitTimestamp.length){
            patient.exitTimestamp.push(new Date());
            Patient.update({patientId: patient.id}, {exitTimestamp: patient.exitTimestamp}, patientATUpdated);
        }
        else {
            patient.enterTimestamp.push(new Date());
            Patient.update({patientId: patient.id}, {enterTimestamp: patient.enterTimestamp}, patientATUpdated);
            _.each($scope.patientList, function (ptnt, index, list) {
                if(patient.physician._id === ptnt.physician._id && 
                patient._id != ptnt._id && 
                ptnt.enterTimestamp.length > ptnt.exitTimestamp.length) {
    
                    ptnt.exitTimestamp.push(new Date());
                    Patient.update({patientId: ptnt.id}, {exitTimestamp: ptnt.exitTimestamp}, function (updatedPatient) {
                        $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
                    });
                }
            });
        }

        function patientATUpdated (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].enterTimestamp = updatedPatient.enterTimestamp;
            $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
        }
    }    

    $scope.getATtimer = function (patient) {

        var counter = 0;
        for (var i = 0; i < patient.enterTimestamp.length; i++) {
            if(patient.exitTimestamp[i])
                counter += (new Date(patient.exitTimestamp[i])).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
            else
                counter += (new Date()).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
        };

        var colorStateAT = "";
        var counterAux = counter/60000;  //to minutes.
        if(counterAux <= 15)
            colorStateAT = "timer-on-time";
        else if(counterAux > 15 && counterAux <= 30)
            colorStateAT = "timer-delay-15";
        else if(counterAux > 30 && counterAux <= 45)
            colorStateAT = "timer-delay-30";
        else if(counterAux > 45)
            colorStateAT = "timer-delay-45";
        
        $scope.colorStateAT = colorStateAT;

        return new Date(counter);
    }

    // Imaging Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.getImagingState = function (patient){
        var imagingStateIcon = "";

        if(patient.needsImaging)
            if(patient.imagingTimestamp){
                imagingStateIcon = "img/ok1icon.svg";  
            }
            else{
                imagingStateIcon = "img/yicon.png";
            }
        else
            imagingStateIcon = "img/nicon.png";
        
        return imagingStateIcon;
    }

    $scope.toogleImagingState = function (patient){
        if(patient.imagingTimestamp){
            var resp = confirm("Are you sure you would like to mark imaging as incomplete?");
            if (resp == true) {
                Patient.update({patientId: patient.id}, {needsImaging: true, imagingTimestamp: null}, patientImagingUpdateConfirmation);       
            }
        }

        if(!$scope.isImagingClickable(patient)) return;

        if(patient.needsImaging)
        {
            Patient.update({patientId: patient.id}, {needsImaging: false, imagingRequestedTimestamp: null}, patientImagingUpdated);
        }
        else
        {
            Patient.update({patientId: patient.id}, {needsImaging: true, imagingRequestedTimestamp: new Date()}, patientImagingUpdated);
        }
        
        function patientImagingUpdateConfirmation(updatedPatient){
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].needsImaging = updatedPatient.needsImaging;
            $scope.patientList[index].imagingTimestamp = updatedPatient.imagingTimestamp;
        }

        function patientImagingUpdated (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].needsImaging = updatedPatient.needsImaging;
        }
    }

    $scope.completeImagingState = function (patient){

        Patient.update({patientId: patient.id}, {imagingTimestamp: new Date()}, function (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].imagingTimestamp = updatedPatient.imagingTimestamp;
        });
    }

    $scope.isImagingClickable = function (patient) {
        if(patient.needsImaging && patient.imagingTimestamp)
            return false;
        else if(patient.currentState == "DC")
            return false;
        else
            return true;
    }

    // Messages Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.sendImagingMessage = function (patient) {

        if(!patient.noPhone) {
            var modalInstance = $modal.open({
                templateUrl: '/partials/sendMessage.html',
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

    $scope.msjToCustom = function (patient) {
        patient.messageSelectorPos = 1;
        patient.message = "";
    }

    $scope.msjToDefault = function (patient) {
        patient.messageSelectorPos = 17;
        patient.message = "This is a defalt message";
    }

    $scope.sendMessage = function (patient) {
        Messages.sendMessage({
            patient: patient,
            message: patient.message
        }, function messageSent (sentMessage) {
            patient.message = "";
            Alerts.addAlert("success", "message sent!");
        });
        Alerts.addAlert("success", "message on it's way...");
    }

    $scope.sendBulkMessages = function () {

        var modalInstance = $modal.open({
            templateUrl: '/partials/sendMessageBulk.html',
            controller: 'bulkMessageCtrl',
            resolve: {
                patients: function () {
                    return $scope.patientList;
                }
            }
        });

        modalInstance.result.then(function () {
            $log.info('Imaging message sent!');
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });  
    }


    // Times calculation
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $rootScope.getWRTime = function (patient) {

        if(patient.currentState == "NCI") return 0;

        var wrDate = new Date(patient.WRTimestamp);
        var apptDate = new Date(patient.apptTime);
        var exDate = new Date(patient.EXTimestamp);
        var nowDate = new Date();

        if(patient.currentState == "WR")
            if(apptDate.getTime() < wrDate.getTime()) // in the case patient arrived late
                return Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
            else
                return Math.round((nowDate.getTime() - apptDate.getTime()) / (60*1000));
        else 
            if(apptDate.getTime() < wrDate.getTime())
                return Math.round((exDate.getTime() - wrDate.getTime()) / (60*1000));
            else
                return Math.round((exDate.getTime() - apptDate.getTime()) / (60*1000));
    }

    $rootScope.getEXTime = function (patient) {

        if(patient.currentState == "NCI" || patient.currentState == "WR") return 0;

        var exDate = new Date(patient.EXTimestamp);
        var dcDate = new Date(patient.DCTimestamp);
        var nowDate = new Date();

        if(patient.currentState == "EX")
            return Math.round((nowDate.getTime() - exDate.getTime()) / (60*1000));
        else 
            return Math.round((dcDate.getTime() - exDate.getTime()) / (60*1000));
    }    

    $scope.getTotalTime = function (patient){

        if(patient.currentState == "NCI") return 0;  

        var wrDate = new Date(patient.WRTimestamp);
        var apptDate = new Date(patient.apptTime);
        var dcDate = new Date(patient.DCTimestamp);
        var nowDate = new Date();
        var totalTime = 0;

        if(patient.currentState == "EX" || patient.currentState == "WR")
            totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
            // if(apptDate.getTime() < wrDate.getTime())
            //     totalTime = Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
            // else
            //     totalTime = Math.round((nowDate.getTime() - apptDate.getTime()) / (60*1000));
        else 
            totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));
            // if(apptDate.getTime() < wrDate.getTime())
            //     totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));
            // else
            //     totalTime = Math.round((dcDate.getTime() - apptDate.getTime()) / (60*1000));

        return totalTime > 0 ? totalTime : 0;
    }

    $rootScope.getTimerColor = function (type, patient) {
        var nMins = 0;

        if(type == "WR") {
            if(patient.currentState == "NCI" || patient.currentState == "EX" || patient.currentState == "DC") 
                return "timer-not-started";
            nMins = $scope.getWRTime(patient);
        }
        else if(type == "EX") {
            if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "DC") 
                return "timer-not-started";
            nMins = $scope.getEXTime(patient);
        }
        else if(type == "WRH") {
            nMins = $scope.getWRTime(patient);
        }
        else if(type == "EXH") {
            nMins = $scope.getEXTime(patient);
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


    // New Patient
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.newPatient = function () {
        
        var modalInstance = $modal.open({
            templateUrl: '/partials/registerPatient.html',
            controller: 'registerPatientCtrl',
            resolve: {
                patient: function () {
                    return null;
                },
                physicians: function () {
                    return $rootScope.selectedPhysicians;
                }
            }
        });

        modalInstance.result.then(function (patient) {
            $scope.patientList.push(patient);
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }


    // State Changing
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.register = function (patient) {
        
        var modalInstance = $modal.open({
            templateUrl: '/partials/registerPatient.html',
            controller: 'registerPatientCtrl',
            resolve: {
                patient: function () {
                    return patient;
                },
                physicians: function () {
                    return $rootScope.selectedPhysicians;
                }
            }
        });

        modalInstance.result.then(function (patient) {
            Patient.update({patientId: patient.id}, 
                {
                    currentState: "WR",
                    WRTimestamp: new Date(),
                    cellphone: patient.cellphone,
                    noPhone: patient.noPhone
                }, 
                function patientWaitingRoom (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    $scope.patientList[index].currentState = updatedPatient.currentState;
                    $scope.patientList[index].WRTimestamp = updatedPatient.WRTimestamp;
                    $scope.patientList[index].cellphone = updatedPatient.cellphone;
                    $scope.patientList[index].noPhone = updatedPatient.noPhone;
                }
            );
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }

    $scope.callBack = function (patient) {

        var updatePatient = function () {
            Patient.update({patientId: patient.id}, 
                {
                    currentState: "EX",
                    EXTimestamp: new Date()
                }, 
                function patientExamRoom (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    $scope.patientList[index].currentState = updatedPatient.currentState;
                    $scope.patientList[index].EXTimestamp = updatedPatient.EXTimestamp;
                }
            );
        }

        if(!patient.noPhone) {
            var modalInstance = $modal.open({
                templateUrl: '/partials/sendMessage.html',
                controller: 'sendMessageCtrl',
                resolve: {
                    patient: function () {
                        return patient;
                    },
                    messageType: function () {
                        return "Call";
                    },
                    // messageCache: function (){
                    //     return messageStorage;
                    // }
                }
            });

            modalInstance.result.then(function () {
                updatePatient();
            }, function () {
                $log.info('Message Modal dismissed at: ' + new Date());
            });  
        }
        else {
            updatePatient();
        }
    }

    $scope.discharge = function (patient) {
        patient.exitTimestamp.push(new Date());
        Patient.update({patientId: patient.id}, 
            {
                currentState: "DC",
                DCTimestamp: new Date(),
                exitTimestamp: patient.exitTimestamp
            }, 
            function patientDischarged (updatedPatient) {
                var index = $scope.patientList.indexOf(patient); 
                $scope.patientList[index].currentState = updatedPatient.currentState;
                $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
                $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
            }
        );
    }

    $scope.showMessage = true;

  }]);

// =============================== MODAL DIALOGS CTRL ===================================

orthopaedicsControllers.controller('sendMessageCtrl', ['$scope', '$modalInstance', 'Messages', 'Alerts', 'patient', 'messageType',
  function($scope, $modalInstance, Messages, Alerts, patient, messageType) {

    $scope.patient = patient;
    if(messageType != "Bulk") {

        var messageCache = "";
        $scope.messageType = messageType;
        var localStorageKey = $scope.messageType + patient.physician._id;
        var localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

        if(localStorageValue) {
            var dateNow = new Date();
            dateNow.setHours(0);
            dateNow.setMinutes(0);
            dateNow.setSeconds(0);
            
            if(Math.abs(dateNow.getTime() - new Date(localStorageValue.date).getTime()) > 1000) {
                localStorage.removeItem(localStorageKey);
                localStorageKey = null;
                localStorageValue = null;
            }
            else {
                messageCache = localStorageValue.msj;
            }
        }

        $scope.patientMessage = messageCache;
    }

    $scope.sendMessage = function () {

        if(messageType == "Bulk") {
            Messages.sendBulkMessages({
                patient: patient,
                message: $scope.patientMessage
            }, function messageSent (sentMessage) {
                // Alerts.addAlert("success", "message sent");
            });
            Alerts.addAlert("success", "message sent");
            $modalInstance.close();
        }
        else {
            Messages.sendMessage({
                patient: patient,
                message: $scope.patientMessage
            }, function messageSent (sentMessage) {
                // Alerts.addAlert("success", "message sent!");
            });
            
            var localStorageValue = localStorage.getItem(localStorageKey);
            if (!localStorageValue) {
                var cacheDate = new Date();
                cacheDate.setHours(0);
                cacheDate.setMinutes(0);
                cacheDate.setSeconds(0);

                localStorageValue = {
                    msj: $scope.patientMessage,
                    date: cacheDate
                };
                localStorage.setItem(localStorageKey, JSON.stringify(localStorageValue));
            }

            Alerts.addAlert("success", "message sent");
            $modalInstance.close();
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

orthopaedicsControllers.controller('registerPatientCtrl', ['$scope', '$modalInstance', 'Messages', 'Patient', 'Alerts', 'patient', 'physicians',
  function($scope, $modalInstance, Messages, Patient, Alerts, patient, physicians) {

    $scope.physicians = physicians;
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    if(patient) {
        patient.physician = _.find(physicians, function (physician) {
            return physician._id == patient.physician._id;
        });
        $scope.patient = patient;
        $scope.fieldsDisabled = true;
    }
    else{
        $scope.fieldsDisabled = false;

        var apptDateObj = new Date();
        var mins = apptDateObj.getMinutes();
        apptDateObj.setMinutes(Math.round(mins/10)*10);
        $scope.patient = {
            apptTime: apptDateObj
        }
    } 

    $scope.submit = function () {
        if(patient){
            if($scope.patient.noPhone) {
                $modalInstance.close($scope.patient);
                Alerts.addAlert("success", "no phone number - welcome message not sent");
            }
            else {
                Messages.sendWelcomeMessage({
                    patient: $scope.patient
                }, function messageSent (sentMessage) {
                    // Alerts.addAlert("success", "welcome message sent!");
                });
                $modalInstance.close($scope.patient);
                Alerts.addAlert("success", "welcome message sent");
            }
        }
        else{
            var patientToSave = $scope.patient;
            patientToSave.physician = $scope.patient.physician._id;
            patientToSave.currentState = "NCI";
            if(!patientToSave.apptTime) patientToSave.apptTime = new Date();

            Patient.save(patientToSave, function (newPatient) {
                newPatient.physician = _.find(physicians, function (physician) {
                    return physician._id == newPatient.physician;
                });
                Alerts.addAlert("success", "Patient Registered");
                $modalInstance.close(newPatient);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openDOB = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dobOpened = true;
    };

}]);

orthopaedicsControllers.controller('bulkMessageCtrl', ['$scope', '$modalInstance', '$modal', '$log', 'Messages', 'patients',
  function($scope, $modalInstance, $modal, $log, Messages, patients) {

    patients = _.filter(patients, function (patient) { return patient.cellphone; });
    $scope.patients = patients;
    $scope.orderBy = "name";

    $scope.writeMessage = function () {

        var modalInstance = $modal.open({
            templateUrl: '/partials/sendMessage.html',
            controller: 'sendMessageCtrl',
            resolve: {
                patient: function () {
                    return _.filter($scope.patients, function (patient) {
                        return patient.msjSelected;
                    });
                },
                messageType: function () {
                    return "Bulk";
                }
            }
        });

        modalInstance.result.then(function () {
            $log.info('Imaging message sent!');
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
        
        $modalInstance.close();
    };

    $scope.selectAll = function () {
        if($scope.orderBy == "name") {
            _.each($scope.patients, function (element, index, list) {
                list[index].msjSelected = $scope.allSelected;
            });
        }
        else if($scope.orderBy == "physician") {
            _.each($scope.patients, function (value, key, list) {
                _.each(value, function (element, index, pList) {
                    pList[index].msjSelected = $scope.allSelected;
                });

                list[key] = value;
            });
        }
    }

    $scope.changeOrder = function () {
        if($scope.orderBy == "name") {
            $scope.patients = patients;
        }
        else if($scope.orderBy == "physician") {
            $scope.patients = _.groupBy(patients, function (patient) { return patient.physician.name; });
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// =============================== PHYSICIANS CTRL ===================================

orthopaedicsControllers.controller('physiciansCtrl', ['$scope', '$location', '$rootScope', '$window', 'AuthService', 'Physician',
  function($scope, $location, $rootScope, $window, AuthService, Physician) {

    resizePhybar(); // método en el main.js
    $rootScope.selectedPhysicians = [];

    Physician.query(function (physicians) {
        _.each(physicians, function (element, index, list) {
            list[index].selected = false;
        });
        $scope.physicianList = physicians;
    });

    $scope.selectPhysician = function (physician) {
         
        var role = AuthService.currentUser().role;
        physician.selected = !physician.selected;
        
        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
            return physician.selected;
        });
        $scope.phySelectAll = selectedPhysicians.length == $scope.physicianList.length;
    }

    $scope.fillSchedules = function () {
        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
            return physician.selected;
        }); 

        $rootScope.selectedPhysicians = selectedPhysicians;
        $(".physiciansList").css("left", "-37%");
    }

    $scope.tooglePhysiciansList = function () {
        var currentPos = $(".physiciansList").css("left");

        if(currentPos.charAt(0) == "-") // it's hidden
            $(".physiciansList").css("left", "5em");
        else
            $(".physiciansList").css("left", "-37%");
    }

    $scope.selectAll = function () {
        if ($scope.phySelectAll) $scope.phySelectAll = true;
        else $scope.phySelectAll = false;

        angular.forEach($scope.physicianList, function (physician) {
            physician.selected = $scope.phySelectAll;
        });
    }

}]);
