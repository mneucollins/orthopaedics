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

orthopaedicsControllers.controller('scheduleCtrl', ['$scope', '$location', '$rootScope',  'Patient',
  function($scope, $location, $rootScope, Patient) {

    $("nav").removeClass("hidden");
    $("body").removeClass("body-login");
    $scope.currentTime = new Date();

    setInterval(function minuteUpdate () {
      $scope.currentTime = new Date();
    }, 1000);
    $scope.$watch('currentTime', function (newValue, oldValue) { console.log("data updated") });

    Patient.query(function (patients) {
      var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getHours(); });  // sort by appt time (hours)
      $scope.patientList = pList;
    });

    $scope.getNormalizedHour = function (hour) {
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

  }]);

// =============================== PHYSICIANS CTRL ===================================

orthopaedicsControllers.controller('physiciansCtrl', ['$scope', '$location', '$rootScope',  'Patient',
  function($scope, $location, $rootScope, Patient) {


  }]);