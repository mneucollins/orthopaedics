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
		        		$scope.confirmPatient(patients);

		        	}
		        	
		        }, function(err){
		            $log.info('error in database');
		        });
		    }

		    $scope.confirmPatient = function (patients) {
		        
		        var modalInstance = $modal.open({
		            templateUrl : '/app/modules/kiosk/confirm-patient.dialog.html',
		            controller : 'confirmPatientCtrl',
		            resolve : {
		                patients: function () {
		                    return patients;
		                }
		            }
		        });

		        modalInstance.result.then(function (updPatient) {
		            $scope.askCellphone(updPatient);
		        }, function () {
		            $log.info('Message Modal dismissed at: ' + new Date());
		        });
		    }

		    $scope.askCellphone = function (patient){

		    	var modalInstance = $modal.open({
		    		templateUrl : '/app/modules/kiosk/ask-cellphone.dialog.html',
		    		controller : 'askCellphoneCtrl',
		    		resolve : {
		    			patient : function () {
		    				return patient;
		    			}
		    		}
		    	});

		    	modalInstance.result.then(function(updPatient){
		    		$log.info('modal closed, cellphone: '+patient.cellphone);
		    	}, function(){
		    		$log.info('modal dismissed, no cellphone');
		    	})

		    }



		    

		}]

	};
});