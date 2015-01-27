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

    $scope.loadCardClasses = function (patient) {
      
      var classes = "";

      if(patient.currentState == 'WR') {

        classes = "card cardOnTime";
      }
      else if(patient.currentState == 'EX') {

        classes = "card cardDelay";
      }
      if(patient.currentState == 'DC') {

        classes = "cardDischarged";
      }
      else if(patient.currentState == 'NCI') {

        classes = "cardNotChecked";
      }

      return classes;
    }

    $scope.loadTextClasses = function (patient) {
      
      var classes = "";

      if(patient.currentState == 'WR') {

        classes = "textOnTime";
      }
      else if(patient.currentState == 'EX') {

        classes = "textDelay";
      }

      return classes;
    }
<<<<<<< HEAD

    $scope.getImagingState = function (patient){
      var imagingStateIcon = "";

      if(patient.needsImaging){
        if(patient.imagingTimestamp){
          imagingStateIcon = "img/ok1icon.png";
        }
        else{
          imagingStateIcon = "img/yicon.png";
        }
      }
      else{
        imagingStateIcon = "img/nicon.png";
      }

      return imagingStateIcon;
    }

    $scope.getCurrentStatus = function (patient){
      var current_Status = "";
      
      if(patient.currentState == "NCI"){
        current_Status = "WR 0min - EX 0min"
      }
      else if(patient.currentState == "WR"){
        var wrDate = new Date(patient.WRTimestamp);
        var nowDate = new Date();
        var minutes = Math.round((nowDate - wrDate) / (60*1000));
        
        current_Status = "WR " + minutes + "min - EX 0min";
      }
      else if(patient.currentState == "EX"){
        var wrDate = new Date(patient.WRTimestamp);
        var exDate = new Date(patient.EXTimestamp);
        var nowDate = new Date();

        var minutesWR = Math.round((exDate - wrDate) / (60*1000));
        var minutesEX = Math.round((nowDate - exDate) / (60*1000));

        current_Status = "WR " + minutesWR + "min - EX " + minutesEX + "min";
      }
      else if(patient.currentState == "DC"){
        var wrDate = new Date(patient.WRTimestamp);
        var exDate = new Date(patient.EXTimestamp);
        var dcDate = new Date(patient.DCTimestamp);

        var minutesWR = Math.round((exDate - wrDate) / (60*1000));
        var minutesEX = Math.round((dcDate - exDate) / (60*1000));

        current_Status = "WR " + minutesWR + "min - EX " + minutesEX + "min";
      }

      return current_Status;
    }

     $scope.getTotalTime = function (patient){
      var totalTime = "aa";
      var wrDate = new Date(patient.WRTimestamp);
      var exDate = new Date(patient.EXTimestamp);
      var dcDate = new Date(patient.DCTimestamp);

      if(wrDate != "Invalid Date"){
        if(exDate != "Invalid Date"){
          if(dcDate != "Invalid Date"){
            var wrDate = new Date(patient.WRTimestamp);
            var exDate = new Date(patient.EXTimestamp);
            var dcDate = new Date(patient.DCTimestamp);

            var minutesWR = Math.round((exDate - wrDate) / (60*1000));
            var minutesEX = Math.round((dcDate - exDate) / (60*1000));
            totalTime = minutesWR + minutesEX + " min";
          }
          else{
            var wrDate = new Date(patient.WRTimestamp);
            var exDate = new Date(patient.EXTimestamp);
            var nowDate = new Date();
            var minutesWR = Math.round((exDate - wrDate) / (60*1000));
            var minutesEX = Math.round((nowDate - exDate) / (60*1000));
            totalTime = minutesWR + minutesEX + " min";
          }
        }
        else{
          var wrDate = new Date(patient.WRTimestamp);
          var nowDate = new Date();
          var minutes = Math.round((nowDate - wrDate) / (60*1000));
          totalTime = minutes + " min";
        }
      }
      else
      {
        totalTime = "0 min";
      }

      return totalTime;
     }

=======
>>>>>>> 437bc20d968bbf650e0c47e18d9bcae3978cd885
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