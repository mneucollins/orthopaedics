var orthopaedicsControllers = angular.module('orthopaedicsControllers', ['ui.bootstrap']);

// =======================================================
// ========================= HEADER ==================
// =======================================================

  orthopaedicsControllers.controller('headerCtrl', ['$scope', 'AuthService',
    function($scope, AuthService){
      $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
        $scope.isLoggedIn = isLoggedIn;
        $scope.currentUser = AuthService.currentUser();
      });
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
          $location.path("/schedule");
      }, function (err) {
        alert("hakuna matata!");
      });
		};

	}]);

// =============================== SCHEDULE CTRL ===================================

orthopaedicsControllers.controller('scheduleCtrl', ['$scope', '$location', '$rootScope',  '$interval', 'Patient',
  function($scope, $location, $rootScope, $interval, Patient) {

    $("nav").removeClass("hidden");
    $("body").removeClass("body-login");
    $scope.currentTime = new Date();

    $interval(function minuteUpdate () {
      $scope.currentTime = new Date();
    }, 500);

    Patient.query(function (patients) {
      var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getHours(); });  // sort by appt time (hours)
      $scope.patientList = pList;
    });

    $scope.sortPatientsByTime = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getHours(); }); 
        $scope.patientList = pList;
    }

    $scope.sortPatientsByName = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.fullName; }); 
        $scope.patientList = pList;
        $scope.bla = "imageButton";
    }

    $scope.sortPatientsByPhysician = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.physician.name; }); 
        $scope.patientList = pList;
    }

    $scope.sortPatientsByBirth = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ return patient.dateBirth; }); 
        $scope.patientList = pList;
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

        $scope.patientList = pList;
    }

    $scope.sortPatientsByStatus = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ 
            var wrt = $scope.getWRTime(patient);
            var ext = $scope.getEXTime(patient);
            return wrt + ext; 
        }); 
        $scope.patientList = pList;
    }

    $scope.sortPatientsByTotal = function (){
        var pList = _.sortBy($scope.patientList, function(patient){ 
            return $scope.getTotalTime(patient); 
        }); 
        $scope.patientList = pList;
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
      // TODO load patient history
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
        else if(patient.currentState == "NCI" || patient.currentState == "DC")
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
        Patient.update({patientId: patient.id}, 
            {
                currentState: "WR",
                WRTimestamp: new Date()
            }, 
            function patientWaitingRoom (updatedPatient) {
                var index = $scope.patientList.indexOf(patient); 
                $scope.patientList[index].currentState = updatedPatient.currentState;
                $scope.patientList[index].WRTimestamp = updatedPatient.WRTimestamp;
            }
        );
    }

    $scope.callBack = function (patient) {
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

  }]);

// =============================== SCHEDULE OLD CTRL ===================================

orthopaedicsControllers.controller('scheduleOldCtrl', ['$scope', '$location', '$rootScope',  '$interval', 'Patient',
  function($scope, $location, $rootScope, $interval, Patient) {

    $("nav").removeClass("hidden");
    $("body").removeClass("body-login");
    $scope.currentTime = new Date();

    $interval(function minuteUpdate () {
      $scope.currentTime = new Date();
    }, 500);

    // Patient.query(function (patients) {
    //   var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getHours(); });  // sort by appt time (hours)
    //   $scope.patientList = pList;
    // });


  }]);
// =============================== PHYSICIANS CTRL ===================================

orthopaedicsControllers.controller('physiciansCtrl', ['$scope', '$location', '$rootScope', '$window', 'Patient',
  function($scope, $location, $rootScope, $window, Patient) {

    $(".physiciansSidebar").css("height", $window.innerHeight - 60);

    $scope.tooglePhysiciansList = function () {
      var currentPos = $(".physiciansList").css("left");

      if(currentPos.charAt(0) == "-") // it's hidden
        $(".physiciansList").css("left", "83px");
      else
        $(".physiciansList").css("left", "-374px");
    }

  }]);