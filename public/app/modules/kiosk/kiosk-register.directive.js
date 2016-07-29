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
		        	if(patients.length==0){
		        		Alerts.addAlert("warning", "please check your information");
		        	} else {
		        		//Alerts.addAlert("warning", "information ok");
		        		$scope.confirmPatient(patients);

		        	}
		        	
		        }, function(err){
		            alert("error :=(");
		        });
		    }

		    $scope.confirmPatient = function (patients) {
		        
		        var modalInstance = $modal.open({
		            templateUrl: '/app/modules/kiosk/confirm-patient.dialog.html',
		            controller: 'confirmPatientCtrl',
		            resolve: {
		                patients: function () {
		                    return patients;
		                }
		            }
		        });

		        modalInstance.result.then(function (updPatient) {
		            $log.info('modal closed'+updPatient.firstName);
		        }, function () {
		            $log.info('Message Modal dismissed at: ' + new Date());
		        });
		    }



		    

		}]

	};
});