(function(){
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
		            if(err.data != "Internal Server Error")
		            	Alerts.addAlert("warning", err.data + ". Please try again");
		            else
		            	Alerts.addAlert("warning", "your register could not be completed, please try again");

		            // $log.info('error in dtabase');
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

		        confirmModal.result.then(function (status) {

		            $scope.final(status.msgStatus);

		        }, function (reason) {

		        	if(reason == "retry") {
		        		$scope.messageTries++;
		        		if($scope.messageTries >= 3) {
		            		$scope.final(false);
		        		}
		        	}
		            $log.info('Message Modal bc %s dismissed at: ' + new Date(), reason);
		        });
		    }
		}]
	};
});

})();