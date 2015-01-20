var orthopaedicsControllers = angular.module('orthopaedicsControllers', ['ui.bootstrap']);

// =======================================================
// ========================= HEADER ==================
// =======================================================

  // spicaControllers.controller('headerCtrl', ['$scope', 'AuthService',
  //   function($scope, AuthService){
  //     $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
  //       $scope.isLoggedIn = isLoggedIn;
  //       $scope.currentUser = AuthService.currentUser();
  //     });
  // }]);

// =====================================================================================
// ================================ NAVEGACION =========================================
// =====================================================================================

// =============================== LOGIN CTRL ===================================

orthopaedicsControllers.controller('loginCtrl', ['$scope', '$location', 'AuthService',
	function($scope, $location, Video, AuthService) {

		$scope.login = function () {
        AuthService.login($scope.usuario, function(user) {
          alert("Welcome " + user.nombre);
          $location.path("/schedule");
      }, function (err) {
        alert("hakuna matata!");
      });
		};

	}]);

// =============================== SCHEDULE CTRL ===================================

orthopaedicsControllers.controller('scheduleCtrl', ['$scope', '$location', '$rootScope',  'Patient',
  function($scope, $location, $rootScope, Patient) {

    $scope.currentTime = new Date();

    setInterval(function minuteUpdate () {
      $scope.currentTime = new Date();
    }, 1000);
    $scope.$watch('currentTime', function (newValue, oldValue) { console.log("data updated") });

    $scope.groupedPatientList = [];
    var patientList = Patient.query(function (patients) {
      var pList = _.groupBy(patients, function(patient){ return new Date(patient.apptTime).getHours(); });
      pList = _.each(pList, function (value, key, list) {
        $scope.groupedPatientList.push({hour: key, patientList: value});
      });
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