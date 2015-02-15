var orthopaedicsControllers = angular.module('orthopaedicsControllers', ['ui.bootstrap']);

// =======================================================
// ========================= HEADER ==================
// =======================================================

    orthopaedicsControllers.controller('headerCtrl', ['$scope', '$location', 'AuthService',
        function($scope, $location, AuthService){
            $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
            $scope.isLoggedIn = isLoggedIn;
            $scope.currentUser = AuthService.currentUser();
        });

        $scope.logout = function () {
            AuthService.logout(function () {
                $location.path("/login");            
            });
        }
    }]);

// =====================================================================================
// ================================ NAVEGACION =========================================
// =====================================================================================

// =============================== LOGIN CTRL ===================================

orthopaedicsControllers.controller('loginCtrl', ['$scope', '$location', 'AuthService',
	function($scope, $location, AuthService) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");

    $scope.login = function () {
        AuthService.login($scope.user, function(user) {
            alert("Welcome " + user.name);
            $location.path("/dashboard1");
        }, function (err) {
            alert("There was an arror... But remember, hakuna matata!");
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
                var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getHours(); });  // sort by appt time (hours)
                $scope.patientList = $scope.patientList.concat(pList);
            });
        };
    });

    $scope.getPhysicianTime = function (physician) {
        var searchList = _.sortBy($scope.patientList, function(patient){ return patient.apptTime });
        searchList = _.filter(searchList, function (patient) {
            return patient.physician._id == physician._id && 
                    patient.WRTimestamp && !patient.EXTimestamp; // &&
                    // new Date(patient.WRTimestamp).getTime() <= new Date(patient.apptTime).setMinutes + (10*60*1000);
        });

        if(searchList.length <= 0) return 0;

        physician.time = $scope.getWRTime(searchList[0]);
        return physician.time;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    $scope.filteringPhys = true;
    $scope.arrowPhys = "glyphicon glyphicon-chevron-up";
    
    $scope.filteringList = function(selection){
        $scope.filteringTime = false;
        $scope.filteringName = false;
        $scope.filteringPhys = false;
        $scope.filteringDob = false;
        $scope.filteringImag = false;
        $scope.filteringStat = false;
        $scope.filteringTot = false;

        if(selection == 'time')
            $scope.filteringTime = true;
        if(selection == 'name')
            $scope.filteringName = true;
        if(selection == 'physician')
            $scope.filteringPhys = true;
        if(selection == 'dob')
            $scope.filteringDob = true;
        if(selection == 'imaging')
            $scope.filteringImag = true;
        if(selection == 'status')
            $scope.filteringStat = true;
        if(selection == 'total')
            $scope.filteringTot = true;
    };
    
    $scope.sortPatientsByTime = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getHours(); }); 
        setListOrder(pList,'time');
    }

    $scope.sortPatientsByName = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.fullName; }); 
        setListOrder(pList,'name');
    }

    $scope.sortPatientsByPhysician = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.physician.name; }); 
        setListOrder(pList,'physician');
    }

    $scope.sortPatientsByBirth = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.dateBirth; }); 
        setListOrder(pList,'dob');
    }

    $scope.sortPatientsByImaging = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ 
                if(patient.needsImaging)
                    if(patient.imagingTimestamp)
                        return 3;   
                    else
                        return 2;
                else
                    return 1;   
            }); 

        setListOrder(pList,'imaging');
    }

    $scope.sortPatientsByStatus = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ 
            var wrt = $scope.getWRTime(patient);
            var ext = $scope.getEXTime(patient);
            return wrt + ext; 
        }); 
        setListOrder(pList,'status');
    }

    $scope.sortPatientsByTotal = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ 
            return $scope.getTotalTime(patient); 
        }); 
        setListOrder(pList,'total');
    }

    function setListOrder(pList, filterName){
        $scope.arrowTime = "";
        $scope.arrowName = "";
        $scope.arrowPhys = "";
        $scope.arrowDOB = "";
        $scope.arrowImag = "";
        $scope.arrowStat = "";
        $scope.arrowTot = "";

        if(pList.length > 0 && $scope.patientList[0] == pList[0]){
            $scope.patientList = pList.reverse();

            if(filterName == "time")
                    $scope.arrowTime = "glyphicon glyphicon-chevron-down";
            else if(filterName == "name")
                    $scope.arrowName = "glyphicon glyphicon-chevron-down";
            else if(filterName == "physician")
                    $scope.arrowPhys = "glyphicon glyphicon-chevron-down";
            else if(filterName == "dob")
                    $scope.arrowDOB = "glyphicon glyphicon-chevron-down";
            else if(filterName == "imaging")
                    $scope.arrowImag = "glyphicon glyphicon-chevron-down";
            else if(filterName == "status")
                    $scope.arrowStat = "glyphicon glyphicon-chevron-down";
            else if(filterName == "total")
                    $scope.arrowTot = "glyphicon glyphicon-chevron-down";
        }
        else{
            $scope.patientList = pList;
            if(filterName == "time")
                    $scope.arrowTime = "glyphicon glyphicon-chevron-up";
            else if(filterName == "name")
                    $scope.arrowName = "glyphicon glyphicon-chevron-up";
            else if(filterName == "physician")
                $scope.arrowPhys = "glyphicon glyphicon-chevron-up";
            else if(filterName == "dob")
                    $scope.arrowDOB = "glyphicon glyphicon-chevron-up";
            else if(filterName == "imaging")
                    $scope.arrowImag = "glyphicon glyphicon-chevron-up";
            else if(filterName == "status")
                    $scope.arrowStat = "glyphicon glyphicon-chevron-up";
            else if(filterName == "total")
                    $scope.arrowTot = "glyphicon glyphicon-chevron-up";
        }
    }

    $scope.getNormalizedHour = function (hour) {
      var d = new Date(hour);
      hour = d.getHours();
      
      if(hour == 12)
        return hour + " M";
      else if(hour < 12)
        return hour + " AM";
      else
        return parseInt(hour) % 12 + " PM";
    }

    $scope.loadPatientHistory = function (patient) {
      Patient.getHistory({patientId: patient.id}, function (history) {
          patient.history = history;
      })
    }

    $scope.sendCustomMessage = function (patient) {
        Messages.sendMessage({
            patient: patient,
            message: patient.customMessage
        }, function messageSent (sentMessage) {
            alert("message sent!");
        });
    }

    $scope.getImagingState = function (patient){
        var imagingStateIcon = "";

        if(patient.needsImaging)
            if(patient.imagingTimestamp)
                imagingStateIcon = "img/ok1icon.png";   
            else
                imagingStateIcon = "img/yicon.png";
        else
            imagingStateIcon = "img/nicon.png";
        
        return imagingStateIcon;
    }

    $scope.toogleImagingState = function (patient){
        
        if(!$scope.isImagingClickable(patient)) return;

        if(patient.needsImaging)
            Patient.update({patientId: patient.id}, {needsImaging: false, imagingRequestedTimestamp: null}, patientImagingUpdated);
        else
            Patient.update({patientId: patient.id}, {needsImaging: true, imagingRequestedTimestamp: new Date()}, patientImagingUpdated);
        
        function patientImagingUpdated (updatedPatient) {
            var index = $scope.patientList.indexOf(patient); 
            $scope.patientList[index].needsImaging = updatedPatient.needsImaging;
        }
    }

    $scope.isImagingClickable = function (patient) {
        if(patient.needsImaging && patient.imagingTimestamp)
            return false;
        else if(patient.currentState == "DC")
            return false;
        else
            return true;
    }

    $scope.getWRTime = function (patient) {

        if(patient.currentState == "NCI") return 0;

        var wrDate = new Date(patient.WRTimestamp);
        var apptDate = new Date(patient.apptTime);
        var exDate = new Date(patient.EXTimestamp);
        var nowDate = new Date();

        if(patient.currentState == "WR")
            if(nowDate.getTime() < apptDate.getTime()) // starts counting up at appointment time
                return 0;
            else
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

    $scope.getEXTime = function (patient) {

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

        if(patient.currentState == "EX" || patient.currentState == "WR")
            if(apptDate.getTime() < wrDate.getTime())
                return Math.round((nowDate.getTime() - wrDate.getTime()) / (60*1000));
            else
                return Math.round((nowDate.getTime() - apptDate.getTime()) / (60*1000));
        else 
            if(apptDate.getTime() < wrDate.getTime())
                return Math.round((dcDate.getTime() - wrDate.getTime()) / (60*1000));
            else
                return Math.round((dcDate.getTime() - apptDate.getTime()) / (60*1000));
    }

    $scope.getTimerColor = function (type, patient) {
        var nMins = 0;

        if(type == "WR") {
            if(patient.currentState == "NCI" || patient.currentState == "EX" || patient.currentState == "DC") 
                return "timer-not-started";
            nMins = $scope.getWRTime(patient);
        }
        if(type == "EX") {
            if(patient.currentState == "NCI" || patient.currentState == "WR" || patient.currentState == "DC") 
                return "timer-not-started";
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

    $scope.register = function (patient) {
        
        var modalInstance = $modal.open({
            templateUrl: '/partials/registerPatient.html',
            controller: 'registerPatientCtrl',
            resolve: {
                patient: function () {
                    return patient;
                }
            }
        });

        modalInstance.result.then(function (patient) {
            Patient.update({patientId: patient.id}, 
                {
                    currentState: "WR",
                    WRTimestamp: new Date(),
                    cellphone: patient.cellphone
                }, 
                function patientWaitingRoom (updatedPatient) {
                    var index = $scope.patientList.indexOf(patient); 
                    $scope.patientList[index].currentState = updatedPatient.currentState;
                    $scope.patientList[index].WRTimestamp = updatedPatient.WRTimestamp;
                    $scope.patientList[index].cellphone = updatedPatient.cellphone;
                }
            );
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
    }

    $scope.callBack = function (patient) {

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

        modalInstance.result.then(function () {
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
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
        
    }

    $scope.discharge = function (patient) {
        Patient.update({patientId: patient.id}, 
            {
                currentState: "DC",
                DCTimestamp: new Date()
            }, 
            function patientDischarged (updatedPatient) {
                var index = $scope.patientList.indexOf(patient); 
                $scope.patientList[index].currentState = updatedPatient.currentState;
                $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
            }
        );
    }

    $scope.showMessage = true;

  }]);

// =============================== MODAL DIALOGS CTRL ===================================

orthopaedicsControllers.controller('sendMessageCtrl', ['$scope', '$modalInstance', 'Messages', 'patient', 'messageType',
  function($scope, $modalInstance, Messages, patient, messageType) {

    $scope.patient = patient;
    $scope.messageType = messageType;

    $scope.sendMessage = function () {

        Messages.sendMessage({
            patient: patient,
            message: $scope.patientMessage
        }, function messageSent (sentMessage) {
            alert("message sent!");
            $modalInstance.close(sentMessage);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

orthopaedicsControllers.controller('registerPatientCtrl', ['$scope', '$modalInstance', 'Messages', 'Patient', 'patient',
  function($scope, $modalInstance, Messages, Patient, patient) {

    $scope.patient = patient;

    $scope.submit = function () {
        Messages.sendWelcomeMessage({
            patient: patient
        }, function messageSent (sentMessage) {
            alert("message sent!");
            $modalInstance.close(patient);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// =============================== PHYSICIANS CTRL ===================================

orthopaedicsControllers.controller('physiciansCtrl', ['$scope', '$location', '$rootScope', '$window', 'AuthService', 'Physician',
  function($scope, $location, $rootScope, $window, AuthService, Physician) {

    $(".physiciansSidebar").css("height", $window.innerHeight - 60);
    $(".physiciansList").css("height", $window.innerHeight - 60);
    $rootScope.selectedPhysicians = [];

    setTimeout(function(){
        $('#physicianSearchList').btsListFilter('#physicianSearch', {itemChild: 'span'});
    }, 500);

    Physician.query(function (physicians) {
        _.each(physicians, function (element, index, list) {
            list[index].selected = false;
        });
        $scope.physicianList = physicians;
    });

    $scope.selectPhysician = function (physician) {
         
        var role = AuthService.currentUser().role;
        if(role == "Physician" || role == "FirstProvider") {
            var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
                return physician.selected;
            });

            if(selectedPhysicians.length >= 2 && !physician.selected) {
                alert("Only two Physicians allowed");
                return;
            }
        }
        physician.selected = !physician.selected;
    }

    $scope.fillSchedules = function () {
        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
            return physician.selected;
        }); 

        $rootScope.selectedPhysicians = selectedPhysicians;
        $(".physiciansList").css("left", "-500px");
    }

    $scope.tooglePhysiciansList = function () {
        var currentPos = $(".physiciansList").css("left");

        if(currentPos.charAt(0) == "-") // it's hidden
            $(".physiciansList").css("left", "54px");
        else
            $(".physiciansList").css("left", "-500px");
    }

}]);
