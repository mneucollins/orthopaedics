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

		    $scope.$watch("patient.dateBirthStr", function (newVal) {
		    	// if(!_.isDate($scope.patient.dateBirth))
		    	$scope.patient.dateBirth = newVal;
		    });
		    $scope.$watch("patient.dateBirth", function (newVal) {
		    	if($scope.patient.dateBirthStr != $scope.patient.dateBirth)
		    		$scope.patient.dateBirthStr = moment(newVal).format("MM/DD/YYYY");
		    });

		    // $scope.confirmPatient = function (patients) {
		        
		    //     var modalInstance = $modal.open({
		    //         templateUrl : '/app/modules/kiosk/confirm-patient.dialog.html',
		    //         controller : 'confirmPatientCtrl',
		    //         resolve : {
		    //             patients: function () {
		    //                 return patients;
		    //             }
		    //         }
		    //     });

		    //     modalInstance.result.then(function (updPatient) {
		    //         $scope.askCellphone(updPatient);
		    //     }, function () {
		    //         $log.info('Message Modal dismissed at: ' + new Date());
		    //     });
		    // }

		    // $scope.askCellphone = function (patient){

		    // 	var modalInstance = $modal.open({
		    // 		templateUrl : '/app/modules/kiosk/ask-cellphone.dialog.html',
		    // 		controller : 'askCellphoneCtrl',
		    // 		resolve : {
		    // 			patient : function () {
		    // 				return patient;
		    // 			}
		    // 		}
		    // 	});

		    // 	modalInstance.result.then(function(updPatient){
		    // 		$log.info('modal closed, cellphone: '+patient.cellphone);
		    // 	}, function(){
		    // 		$log.info('modal dismissed, no cellphone');
		    // 	})

		    // }

		}]
	};
});