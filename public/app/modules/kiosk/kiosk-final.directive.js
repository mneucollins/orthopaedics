angular.module('kioskModule')
.directive('kioskFinal',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {
		// 	patient : "=",
		// 	showTab : "="
		// },
		templateUrl : '/app/modules/kiosk/kiosk-final.html',
		controller:['$scope', '$location', '$timeout', function($scope, $location, $timeout){

			$timeout(function() {
				$location.path("/kiosk");
			}, 7 * 1000);
		}]
	};
});