angular.module('adminModule')
.directive('messagesConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/messages-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts', 
		function($scope, $rootScope, $modal, $log, Patient, Alerts){

			$scope.config ={};

			
		}]
	}
});