angular.module('kioskModule')
.directive('kioskRegister',function(){ 
	return {
		replace : true,
		restrict : 'E',
		// scope : {
		// 	patient : "=",
		// 	showTab : "="
		// },
		templateUrl : '/app/modules/kiosk/kiosk-register.html',
		controller:['$scope', '$modal', '$log', 'Patient', 'Alerts', 
			function($scope, $modal, $log, Patient, Alerts){

			$scope.dobOpened = false;

		    $scope.openDOB = function($event) {
		        $event.preventDefault();
		        $event.stopPropagation();

		        $scope.dobOpened = true;
		    };

		    $scope.searchPatient = function(){
		        
		        Patient.search({},{patient:$scope.patient}, function(patients){
		        	if(patients.length==0) {
		        		// Alerts.addAlert("warning", "We are sorry for this inconvenience, but it seems we are having difficulty locating your information. Please go back to review the information you entered is correct or speak to a front-desk associate so they can check you in manually. Thank you.");
        				
        				$scope.messageTries++;
		        		if($scope.messageTries > 3) {
		            		$scope.final(false);
		        		}
		        		else
		        			$modal.open({templateUrl : 'noPatientModal.html'});
		        	} else {
		        		$scope.patients = patients;
		        		$scope.confirm();
		        	}

		        }, function(err){
		            $log.info('error in database');
		        });
		    }

		    $scope.formatDate = function () {
		    	if($scope.patient.dateBirthStr.length == 2
		    	|| $scope.patient.dateBirthStr.length == 5)
		    		$scope.patient.dateBirthStr += "/";
		    }

		    $scope.$watch("patient.dateBirthStr", function (newVal) {
		    	// if(!_.isDate($scope.patient.dateBirth))
		    	$scope.patient.dateBirth = newVal;
		    });
		    $scope.$watch("patient.dateBirth", function (newVal) {
		    	if($scope.patient.dateBirthStr != $scope.patient.dateBirth)
		    		$scope.patient.dateBirthStr = moment(newVal).format("MM/DD/YYYY");
		    });



		}]
	};
});