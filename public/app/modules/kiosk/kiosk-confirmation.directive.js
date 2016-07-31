angular.module('kioskModule')
.directive('kioskConfirmation',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {
		// 	patient : "=",
		// 	showTab : "="
		// },
		templateUrl : '/app/modules/kiosk/kiosk-confirmation.html',
		controller:['$scope', '$log', '$modal', 'Patient', 'Alerts', function($scope, $log, $modal, Patient, Alerts){

			if($scope.patients && $scope.patients.length == 1) {
				$scope.selPat = $scope.patients[0];
			}

			$scope.confirmRegister = function() {
		        Patient.preregister({},{patient: $scope.selPat}, function(patient){
		            if(patient) {
		                // $log.info('register complete');
		                // Alerts.addAlert("success", "your register could not be completed, please try again");

		                if($scope.selPat.cellphone && $scope.selPat.cellphone != "")
		                	confirmPhoneNumber();
		                else {
		                	$scope.final(false);
		                }

		            } else {
		                Alerts.addAlert("warning", "your register could not be completed, please try again");
		            }
		            
		        }, function(err){
		            Alerts.addAlert("warning", "your register could not be completed, please try again");
		            $log.info('error in dtabase');
		        });


		        // $modalInstance.close($scope.selPat);
		    }
		    

		    function confirmPhoneNumber() {
		    	var confirmModal = $modal.open({
		            templateUrl : '/app/modules/kiosk/confirm-message.dialog.html',
		            controller : 'confirmPatientCtrl',
		            resolve : {
		                patient: function () {
		                    return $scope.selPat;
		                }
		            }
		        });

		        confirmModal.result.then(function (phoneStatus) {
		            $scope.final(phoneStatus);
		        }, function () {
		            $log.info('Message Modal dismissed at: ' + new Date());
		        });
		    }
		}]
	};
});