angular.module('adminModule')
.directive('messagesConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/messages-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts',
		function($scope, $rootScope, $modal, $log, Config, Alerts) {

			$scope.config ={};

			Config.get(function(data) {
				$scope.config = data;				
			});		

			$scope.saveMessagesChanges = function () {
				Config.update({}, {
					welcomeMsgNoDelayText: $scope.config.welcomeMsgNoDelayText,
					welcomeMsgDelayText: $scope.config.welcomeMsgDelayText,
					firstWaitMsgText: $scope.config.firstWaitMsgText,
					kioskMsgText: $scope.config.kioskMsgText,
					kioskCallMsgText: $scope.config.kioskCallMsgText,
					waitMsgText: $scope.config.waitMsgText,
					longWaitMsgText: $scope.config.longWaitMsgText,
					longWaitMsgMinutes: $scope.config.longWaitMsgMinutes,
					msgInterval: $scope.config.msgInterval,
					maxNumMsgs: $scope.config.maxNumMsgs
				}, function (data) {
                	Alerts.addAlert("success", "Configuration saved!");
				}, function (err) {
					Alerts.addAlert("danger", "Error saving configuration");
				});
			}	
		}]
	}
});