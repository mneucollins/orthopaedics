angular.module('kioskModule')
.directive('kioskWelcome',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {
		// 	patient : "=",
		// 	showTab : "="
		// },
		templateUrl : '/app/modules/kiosk/kiosk-welcome.html',
		controller:['$scope', 'Patient', 'Alerts', function($scope, Patient, Alerts){



		    

		}]

	};
});