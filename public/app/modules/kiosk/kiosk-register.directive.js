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
		controller:['$scope', 'Patient', 'Alerts', 
			function($scope, Patient, Alerts){

			$scope.dobOpened = false;

		    $scope.openDOB = function($event) {
		        $event.preventDefault();
		        $event.stopPropagation();

		        $scope.dobOpened = true;
		    };

		    $scope.searchPatient = function(){
		        
		        Patient.search({},{patient:$scope.patient}, function(patients){
		        	if(patients===0){
		        		alert("funcionooooooo");
		        	}
		        }, function(err){
		            
		        });
		    }



		    

		}]

	};
});