angular.module('adminModule')
.directive('generalConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/general-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts',
		function($scope, $rootScope, $modal, $log, Config, Alerts) {

			$scope.config ={};

			Config.get(function(data) {
				$scope.config = data;				
			});		

			$scope.saveChanges = function () {
				Config.update({}, {
					callbackInterval: $scope.config.callbackInterval,
					frontdeskBanner: $scope.config.frontdeskBanner,
					longWaitMinutes: $scope.config.longWaitMinutes,
					warnWaitMinutes: $scope.config.warnWaitMinutes,
					dangerWaitMinutes: $scope.config.dangerWaitMinutes
				}, function (data) {
                	Alerts.addAlert("success", "Configuration saved!");
				}, function (err) {
					Alerts.addAlert("danger", "Error saving configuration");
				});
			}	
		}]
	}
});