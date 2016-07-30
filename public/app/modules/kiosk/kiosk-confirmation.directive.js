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
		controller:['$scope', '$modal', 'Patient', 'Alerts', function($scope, $modal, Patient, Alerts){


			$scope.confirmRegister = function() {
		        Patient.preregister({},{patientId: $scope.selPat}, function(patient){
		            if(patient) {
		                // $log.info('register complete');
		                // Alerts.addAlert("success", "your register could not be completed, please try again");

		                if(patient.cellphone && patient.cellphone != "")
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
		            controller : 'confirmMessageCtrl',
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