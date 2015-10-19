var orthopaedicsControllers = angular.module('orthopaedicsControllers', ['ui.bootstrap']);

// =======================================================
// ========================= HEADER ==================
// =======================================================

orthopaedicsControllers.controller('headerCtrl', ['$scope', '$rootScope', '$location', '$interval', '$modal', '$log', 'AuthService',
    function($scope, $rootScope, $location, $interval, $modal, $log, AuthService){
        
        $scope.showTab = "info"; // info, msg, prior, notes
        $scope.showMessage = false;
        $scope.showMessageAux = false;
        $rootScope.hideDischarged = true;
        $rootScope.hideDeleted = true;

        $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
            $scope.isLoggedIn = isLoggedIn;
            $scope.currentUser = AuthService.currentUser();
        });

        $scope.logout = function () {
            AuthService.logout(function () {
                $location.path("/login");            
            });
        }

        $scope.showReportsDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: '/partials/showReports.html',
                controller: 'showReportsCtrl',
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                $log.info('reports generated!');
            }, function () {
                $log.info('Message Modal dismissed at: ' + new Date());
            });
        }

        $scope.showNotesDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: '/partials/showNotes.html',
                controller: 'showNotesCtrl',
                resolve: {
                    patients: function () {
                        return _.filter($rootScope.patientList, function (pat) {
                            return pat.notes && pat.notes != "";
                        });
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('notes shown!');
            }, function () {
                $log.info('Message Modal dismissed at: ' + new Date());
            });
        }

        $interval(function () {
            var url = $location.path();

            if(url.indexOf("dashboard1") != -1){
                $rootScope.dashboard = "1";
                if($scope.currentUser.role == "Physician" || $scope.currentUser.role == "FirstProvider")
                    $location.url("/dashboard2");
            } 
            else if(url.indexOf("dashboard2") != -1) {
                $rootScope.dashboard = "2";
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

orthopaedicsControllers.controller('loginCtrl', ['$scope', '$location', '$modal','AuthService', 'Alerts', 'User',
	function($scope, $location, $modal, AuthService, Alerts, User) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    var theUser;
    $scope.panelStatus = 'login';
    $scope.securityQuestions = [
        // "Who was your first kiss?",
        "Who was your favorite teacher in school?",
        "What was the first concert you attended?",
        "What is your mother's maiden name?",
        "What was the name of your first pet?",
        "What street did you grow up on?"
    ];

    $scope.login = function () {
        AuthService.login($scope.user, function(user) {

            if(!user.securityQuestion){
                theUser = user;
                $scope.panelStatus = 'completeProfile';
                return;
            }

            goToDashboard(user);

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.signup = function () {

        if($scope.user.password != $scope.user.passwordRepeat) {
            Alerts.addAlert("warning", "passwords must match!");
            return;
        }

        if(!$scope.user.name
        || !$scope.user.department
        || !$scope.user.email
        || !$scope.user.username
        || !$scope.user.password
        // || ($scope.user.isPhysician && !$scope.user.npi)
        || !$scope.user.securityQuestion
        || !$scope.user.securityAnswer) {

            Alerts.addAlert("warning", "Please fill all fields");
            return;
        }

        // if($scope.user.isPhysician && !$scope.user.npi)

        delete $scope.user.passwordRepeat;
        $scope.user.email = $scope.user.email.toLowerCase();
        $scope.user.username = $scope.user.username.toLowerCase();

        AuthService.signup($scope.user, function(user) {

            // goToDashboard(user);
            $scope.panelStatus = 'afterSignup';

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.completeProfile = function () {
        User.setSecurityQuestions({userId: theUser._id}, {
            email: $scope.user.email, 
            securityQuestion: $scope.user.question, 
            securityAnswer: $scope.user.answer
        }, function(user) {
            if(!user) {
                Alerts.addAlert("warning", "There was an error saving the user");
                return;
            }
            
            goToDashboard(user);

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.passwordRetrieval = function () {
        User.retrievePassword({}, {email: $scope.user.email}, 
        function(user) {
            Alerts.addAlert("success", "Please check your email");

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    function goToDashboard (user) {
        Alerts.addAlert("success", "Welcome " + user.name);

        if(user.role == "Imaging" || user.role == "Receptionist")
            $location.path("/dashboard1");
        else
            $location.path("/dashboard2");
    }

        // E-Mail Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.openHelpModal = function () {

        var modalInstance = $modal.open({
            templateUrl: '/partials/sendMail.html',
            controller: 'sendEmailCtrl',
            resolve: {
                messageType: function () {
                    return "help";
                }
            }
        });

        modalInstance.result.then(function () {
            $log.info('Help message sent!');
        }, function () {
            $log.info('Help Modal dismissed at: ' + new Date());
        });  
    
    }

}]);

orthopaedicsControllers.controller('restoreCtrl', ['$scope', '$location', '$routeParams', 'AuthService', 'Alerts', 'User',
    function($scope, $location, $routeParams, AuthService, Alerts, User) {

        $("nav").addClass("hidden");
        $("body").addClass("body-login");

        $scope.panelStatus = 'newPassword';
        User.getByToken({token: $routeParams.token}, function (user) {
            
            $scope.user = user;

        }, function () {
            Alerts.addAlert("danger", "Invalid token request!");
            $scope.panelStatus = 'keine';
        });

        $scope.restorePassword = function () {

            if($scope.user.password != $scope.user.passwordRepeat) {
                Alerts.addAlert("warning", "passwords must match!");
                return;
            }

            User.restorePassword({userId: $scope.user._id}, $scope.user, 
            function (user) {
                if(!user) {
                    Alerts.addAlert("warning", "There was an error updating your data. Please verify your data and try again");
                    return;
                }

                Alerts.addAlert("success", "password updated! Please log in with your new password");
                $location.path("/login");
            }, function () {
                Alerts.addAlert("warning", "There was an error updating your data. Please verify your data and try again");
            });
        };
}]);
// =============================== LOGIN CTRL ===================================

orthopaedicsControllers.controller('completeProfileCtrl', ['$scope', '$location', 'AuthService', 'Alerts',
    function($scope, $location, AuthService, Alerts) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $scope.panelStatus = 'completeProfile';

    $scope.completeProfile = function () {
        AuthService.login($scope.user, function(user) {
            Alerts.addAlert("success", "Welcome " + user.name);

            if(user.role == "Imaging" || user.role == "Receptionist")
                $location.path("/dashboard1");
            else
                $location.path("/dashboard2");

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
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
            return $scope.getWRTime(item);
        });
        physician.time = $scope.getWRTime(wrTime);
        return physician.time > 0 ? physician.time : 0;
    }

    $scope.$on('onPatientListed', function(scope, element, attrs){
        $scope.hidePhysicians = $rootScope.selectedPhysicians.length == 1 && $rootScope.dashboard == 2;
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

    $interval(retrieveClinicDelays, 60000);

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
            $scope.patientList = pList;
            $scope.arrowDirection = 0;
        }
        else{
            $scope.patientList = pList.reverse();
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

    $scope.getATIcon = function (patient) {
        
        if(patient.enterTimestamp.length == 0 || patient.currentState == 'DC')
            return "/img/at-entry-gray.svg";
        else if(patient.enterTimestamp.length > patient.exitTimestamp.length)
            return "/img/at-entry-green.svg";
        else if(patient.enterTimestamp.length == patient.exitTimestamp.length && patient.enterTimestamp.length > 0)
            return "/img/at-entry-red.svg";
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
            Patient.update({patientId: patient.id}, {needsImaging: false, imagingRequestedTimestamp: null, imagingStartedTimestamp: null}, patientImagingUpdated);
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

    $scope.startImaging = function (patient) {
        Patient.update({patientId: patient.id}, {imagingStartedTimestamp: new Date()}, function (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].imagingStartedTimestamp = updatedPatient.imagingStartedTimestamp;
        });
    }

    $scope.getImagingMinutes = function (patient) {

        if(!patient.imagingStartedTimestamp) return 0;

        var imagingIniDate = new Date(patient.imagingStartedTimestamp).getTime();
        var imagingEndDate = new Date(patient.imagingTimestamp).getTime();
        var nowDate = new Date().getTime();

        var imagingTime = 0;

        if(patient.imagingTimestamp)
            imagingTime = imagingEndDate - imagingIniDate;
        else
            imagingTime = nowDate - imagingIniDate;

        return Math.round(imagingTime / (60*1000));
    }

    $scope.isImagingStarted = function (patient) {
        return !!patient.imagingStartedTimestamp;
    }    

    $scope.isImagingClickable = function (patient) {
        if(patient.needsImaging && patient.imagingTimestamp)
            return false;
        else if(patient.currentState == "DC")
            return false;
        else
            return true;
    }

    // FC Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.getFCIcon = function (patient){
        var FCStateIcon = "";

        if(!patient.fcStartedTimestamp) {
            FCStateIcon = "/img/fc-inactive.svg";  
        }
        else if(!patient.fcFinishedTimestamp) {
            FCStateIcon = "/img/fc-active.svg";
        }
        else {
            FCStateIcon = "/img/fc-complete.svg";
        }
        
        return FCStateIcon;
    }

    $scope.showFCMinutes = function (patient) {
        
        if(patient.fcFinishedTimestamp) 
            return false;

        var mins = $scope.getFCMinutes(patient);
        return mins >= 15;

    }

    $scope.getFCMinutes = function (patient) {

        if(!patient.fcStartedTimestamp) return 0;

        var fcIniDate = new Date(patient.fcStartedTimestamp).getTime();
        var nowDate = new Date().getTime();

        var fcTime = nowDate - fcIniDate;

        return Math.round(fcTime / (60*1000));
    }

    $scope.toogleFCState = function (patient){

        if(!$scope.isFCClickable(patient)) return;

        if(!patient.fcStartedTimestamp) {
            Patient.update({patientId: patient.id}, {fcStartedTimestamp: new Date()}, patientFCUpdated);
        }
        else if(!patient.fcFinishedTimestamp) {
            Patient.update({patientId: patient.id}, {needsFC: true, fcFinishedTimestamp: new Date()}, patientFCUpdated);
        }
        else {
            var resp = confirm("Are you sure you would like to mark FC as incomplete?");
            if (resp == true) {
                Patient.update({patientId: patient.id}, {fcFinishedTimestamp: null}, patientFCUpdated);       
            }
        }

        function patientFCUpdated (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].fcStartedTimestamp = updatedPatient.fcStartedTimestamp;
            $scope.patientList[index].fcFinishedTimestamp = updatedPatient.fcFinishedTimestamp;
        }
    }

    $scope.isFCClickable = function (patient) {
        if (patient.currentState == "WR" || patient.currentState == "NCI")
            return true;
        else
            return false;
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
        else 
            totalTime = Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));

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


    // Patient CRUD
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
                },
                modalFunction: function () {
                    return "new";
                }
            }
        });

        modalInstance.result.then(function (patient) {
            $scope.patientList.push(patient);
            $scope.filteringActive($scope.colFilter);
            $scope.filteringActive($scope.colFilter);
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }

    $scope.editPatient = function (patient) {
        
        var modalInstance = $modal.open({
            templateUrl: '/partials/registerPatient.html',
            controller: 'registerPatientCtrl',
            resolve: {
                patient: function () {
                    return patient;
                },
                physicians: function () {
                    return $rootScope.selectedPhysicians;
                },
                modalFunction: function () {
                    return "edit";
                }
            }
        });

        modalInstance.result.then(function (updPatient) {
            var listPatient = _.find($scope.patientList, function(patient){ 
                return patient.id == updPatient.id; 
            });

            if(listPatient) {
                var index = $scope.patientList.indexOf(listPatient);
                $scope.patientList[index] = updPatient; 
                $scope.$apply();
            }
            else {
                Alerts.addAlert("danger", "Unknown error updating the patient. Please refresh the page");
            }
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }

    $scope.deletePatient = function (patient) {
        var resp = confirm("Are you sure you would like to delete this patient?");
        
        if (resp == true) {
            Patient.update({patientId: patient.id}, 
                {isDeleted: true, deletedTimestamp: new Date()}, 
                function (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    if(index >= 0) {
                        $scope.patientList[index].isDeleted = updatedPatient.isDeleted;
                        $scope.patientList[index].deletedTimestamp = updatedPatient.deletedTimestamp;
                    }
                    Alerts.addAlert("danger", "Unknown error updating the patient. Please refresh the page");
                });       
        }   
    }

    $scope.restoreDeletedPatient = function (patient) {
        var resp = confirm("Are you sure you would like to restore this patient?");
        
        if (resp == true) {
            Patient.update({patientId: patient.id}, 
                {isDeleted: false, deletedTimestamp: null}, 
                function (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    if(index >= 0) {
                        $scope.patientList[index].isDeleted = updatedPatient.isDeleted;
                        $scope.patientList[index].deletedTimestamp = updatedPatient.deletedTimestamp;
                    }
                    Alerts.addAlert("success", "Patient restored");
                });       
        }   
    }

    $scope.restoreDischargedPatient = function (patient) {
        var resp = confirm("Are you sure you would like to restore this patient?");
        
        if (resp == true) {
            Patient.update({patientId: patient.id}, 
                {DCTimestamp: null, currentState: "EX"}, 
                function (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    if(index >= 0) {
                        $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
                        $scope.patientList[index].currentState = updatedPatient.currentState;
                    }
                    Alerts.addAlert("success", "Patient restored");
                });       
        }   
    }

    $scope.saveNotes = function (patient) {
        
        Patient.update({patientId: patient.id}, 
            {notes: patient.notes}, 
            function (updatedPatient) {
                var index = $scope.patientList.indexOf(patient); 
                if(index >= 0) {
                    $scope.patientList[index].notes = updatedPatient.notes;
                }
                Alerts.addAlert("success", "Notes Saved");
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
                },
                modalFunction: function () {
                    return "register";
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
                    if(index >= 0) {
                        $scope.patientList[index].currentState = updatedPatient.currentState;
                        $scope.patientList[index].WRTimestamp = updatedPatient.WRTimestamp;
                        $scope.patientList[index].cellphone = updatedPatient.cellphone;
                        $scope.patientList[index].noPhone = updatedPatient.noPhone;
                    }

                    setTimeout(function () {
                        if(!patient.callbackEnabled)
                            Patient.update({patientId: patient.id}, 
                                {callbackEnabled: true}, 
                                function (updatedPatient) {
                                    var index = $scope.patientList.indexOf(patient); 
                                    if(index >= 0) {
                                        $scope.patientList[index].callbackEnabled = updatedPatient.callbackEnabled;
                                    }
                                }
                            );
                    }, 5 * 60 * 1000);
                }
            );
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }

    $scope.callBack = function (patient) {
        // var fcTimeElapsed = (new Date().getTime() - new Date(patient.WRTimestamp).getTime()) / (60*1000);
        
        if(patient.callbackEnabled) {
            var modalInstance = $modal.open({
                templateUrl: '/partials/sendMessage.html',
                controller: 'sendMessageCtrl',
                resolve: {
                    patient: function () {
                        return patient;
                    },
                    messageType: function () {
                        return "Call";
                    }
                }
            });
        }
        else if(patient.callbackPressed) {
            Patient.update({patientId: patient.id}, 
                {callbackEnabled: true}, 
                function (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    if(index >= 0) {
                        $scope.patientList[index].callbackEnabled = updatedPatient.callbackEnabled;
                    }
                }
            );
        }
        else {
            patient.callbackPressed = true;
            var css = {
                "transition": "all 3s linear",
                "background-color": "#428bca"
            }
            $('.pat_' + patient._id + " .btnCallBack").css(css);

            function disableCallback (patient) {
                setTimeout(function () {
                    if($('.pat_' + patient._id + " .btnCallBack").hasClass("btn-primary")) 
                        return;

                    patient.callbackPressed = false;
                    var css = {
                        "transition": "all 0.3s linear",
                        "background-color": "#fff"
                    }
                    $('.pat_' + patient._id + " .btnCallBack").css(css);
                }, 3000);
            }
            disableCallback(patient);
        }

        if(modalInstance)
            modalInstance.result.then(function (roomNumber) {
                Patient.update({patientId: patient.id}, 
                    {
                        currentState: "EX",
                        EXTimestamp: new Date(),
                        roomNumber: roomNumber
                    }, 
                    function patientExamRoom (updatedPatient) {
                        var index = $scope.patientList.indexOf(patient); 
                        if(index >= 0) {
                            $scope.patientList[index].currentState = updatedPatient.currentState;
                            $scope.patientList[index].EXTimestamp = updatedPatient.EXTimestamp;
                        }
                    }
                );
            }, function () {
                $log.info('Message Modal dismissed at: ' + new Date());
            }); 
    }

    // var dischargePressed = false;
    $scope.discharge = function (patient) {

        if(patient.dischargePressed){
            patient.exitTimestamp.push(new Date());
            Patient.update({patientId: patient.id}, 
                {
                    currentState: "DC",
                    DCTimestamp: new Date(),
                    exitTimestamp: patient.exitTimestamp
                }, 
                function patientDischarged (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    if(index >= 0) {
                        $scope.patientList[index].currentState = updatedPatient.currentState;
                        $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
                        $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
                    }
                }
            );
        }
        else {
            patient.dischargePressed = true;
            var css = {
                "transition": "all 3s linear",
                "background-color": "#428bca"
            }
            $('.pat_' + patient._id + " .btnDischarge").css(css);

            function disableDischarge (patient) {
                setTimeout(function () {
                    patient.dischargePressed = false;
                    var css = {
                        "transition": "all 0.3s linear",
                        "background-color": "#fff"
                    }
                    $('.pat_' + patient._id + " .btnDischarge").css(css);
                }, 3000);
            }
            disableDischarge(patient);
            
        }

    }
    
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
            $modalInstance.close($scope.patient.roomNumber);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
orthopaedicsControllers.controller('sendEmailCtrl', ['$scope', '$modalInstance', 'Emails', 'Alerts', 'messageType',
  function($scope, $modalInstance, Emails, Alerts, messageType) {

    $scope.messageType = messageType;
    $scope.mailSender = {};
    
    $scope.sendMail = function () {

        if(messageType == "help")
            Emails.sendHelpMail({
                name: $scope.mailSender.name,
                email: $scope.mailSender.email,
                subject: $scope.mailSender.subject,
                mailBody: $scope.mailSender.message
            }, function emailSent (sentMessage) {
                $scope.mailSender = {};
                $modalInstance.close();
                Alerts.addAlert("success", "message sent");
            });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

orthopaedicsControllers.controller('registerPatientCtrl', ['$scope', '$modalInstance', 'Messages', 'Patient', 'Alerts', 'patient', 'physicians', 'modalFunction',
  function($scope, $modalInstance, Messages, Patient, Alerts, patient, physicians, modalFunction) {

    $scope.physicians = physicians;
    $scope.modalFunction = modalFunction;
    $scope.apptTimeLabel = {};
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    if(modalFunction == "register") {
        
        $scope.fieldsDisabled = true;

        patient.physician = _.find(physicians, function (physician) {
            return physician._id == patient.physician._id;
        });
        $scope.patient = patient;
    }
    else if(modalFunction == "new") {

        $scope.fieldsDisabled = false;
        $scope.apptTimeLabel = {"padding-top": "2.5em"};

        var apptDateObj = new Date();
        var mins = apptDateObj.getMinutes();
        apptDateObj.setMinutes(Math.round(mins/10)*10);
        $scope.patient = {
            apptTime: apptDateObj
        }
    } 
    else if(modalFunction == "edit") {

        $scope.fieldsDisabled = false;
        $scope.apptTimeLabel = {"padding-top": "2.5em"};

        patient.physician = _.find(physicians, function (physician) {
            return physician._id == patient.physician._id;
        });
        $scope.patient = patient;
    }

    $scope.submit = function () {
        if(modalFunction == "register"){

            if($scope.patient.noPhone || !$scope.patient.cellphone) {
                $scope.patient.noPhone = true;
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
        else if(modalFunction == "new"){
            var patientToSave = $scope.patient;
            patientToSave.physician = $scope.patient.physician._id;
            patientToSave.currentState = "NCI";
            patientToSave.noPhone = !($scope.patient.cellphone);
            if(!patientToSave.apptTime) patientToSave.apptTime = new Date();

            Patient.save(patientToSave, function (newPatient) {
                newPatient.physician = _.find(physicians, function (physician) {
                    return physician._id == newPatient.physician;
                });
                Alerts.addAlert("success", "Patient Registered");
                $modalInstance.close(newPatient);
            });
        }
        else if(modalFunction == "edit"){
            var patientToSave = $scope.patient;
            patientToSave.physician = $scope.patient.physician._id;
            patientToSave.noPhone = !($scope.patient.cellphone);
            if(!patientToSave.apptTime) patientToSave.apptTime = new Date();

            Patient.update({patientId: $scope.patient._id}, patientToSave, function (newPatient) {
                newPatient.physician = _.find(physicians, function (physician) {
                    return physician._id == newPatient.physician;
                });
                Alerts.addAlert("success", "Patient Saved");
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

orthopaedicsControllers.controller('showReportsCtrl', ['$scope', '$modalInstance', 'Reports',
  function($scope, $modalInstance, Reports) {

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.submit = function () {
        window.open("/api/reports/generate?" +
            "iniDate=" + $scope.reportGen.iniDate.toISOString() +
            "&endDate=" + $scope.reportGen.endDate.toISOString());
        // Reports.generate($scope.reportGen, function (data) {
            $modalInstance.close();
        // });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openStartDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startDateOpened = true;
    };

    $scope.openEndDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endDateOpened = true;
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

orthopaedicsControllers.controller('showNotesCtrl', ['$scope', '$modalInstance', 'patients',
  function($scope, $modalInstance, patients) {

    $scope.patients = patients;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// =============================== PHYSICIANS CTRL ===================================

orthopaedicsControllers.controller('physiciansCtrl', ['$scope', '$location', '$rootScope', '$window', 'AuthService', 'Physician',
  function($scope, $location, $rootScope, $window, AuthService, Physician) {

    setTimeout(resizePhybar, 100); // método en el main.js
    $rootScope.selectedPhysicians = [];
    $rootScope.hidePhysiciansList = false;

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
        $rootScope.hidePhysiciansList = true;
        // $(".physiciansList").css("left", "-37%");
    }

    $rootScope.tooglePhysiciansList = function () {
        $rootScope.hidePhysiciansList = !$rootScope.hidePhysiciansList;
        // var currentPos = $(".physiciansList").css("left");

        // if(currentPos.charAt(0) == "-") // it's hidden
        //     $(".physiciansList").css("left", "5em");
        // else
        //     $(".physiciansList").css("left", "-37%");
    }

    $scope.selectAll = function () {
        if ($scope.phySelectAll) $scope.phySelectAll = true;
        else $scope.phySelectAll = false;

        angular.forEach($scope.physicianList, function (physician) {
            physician.selected = $scope.phySelectAll;
        });
    }

}]);
