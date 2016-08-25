angular.module('patientRowModule')
.directive('preRegisterColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/pre-register-column.html',
		controller:['$scope', '$log', '$timeout', 'Patient', function($scope, $log, $timeout, Patient){
		       

			Patient.searchPreRegistered({},{}, function(prPatients){
	        	if(prPatients.length==0) {
	        		// $log.info('no pre registered patients found');
	        	} else {

	        		// $log.info(JSON.stringify(prPatients));

	        		$scope.patient.prIndex = prPatients.indexOf($scope.patient.id) == -1 ? "-" : prPatients.indexOf($scope.patient.id)+1;

	        	}

	        }, function(err){
	            $log.info('error in database');
	        });
	        
			
		}]

	};
});