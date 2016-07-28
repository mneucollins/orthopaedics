angular.module('adminModule')
.directive('roleConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/role-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'User',
		function($scope, $rootScope, $modal, $log, Config, Alerts, User) {

			// $scope.items1 = [];
			// $scope.items2 = [];

			$scope.saveRoleChanges = function () {
				var selectedRole = $scope.selectedItem;
		        if($scope.newUser == true)
		        {
		            User.save($scope.selectedItem, 
		               function (argument) {
		               Alerts.addAlert("success", "User created!");
		               $scope.selectedItem.role = selectedRole;
		               $scope.newUser = false;
		            }, function (err) {
		                Alerts.addAlert("warning", "Error");
		            });
		        }
		        else
		        {
		            $scope.selectedItem.role = $scope.selectedItem._id;
		            User.update({userId: $scope.selectedItem._id}, 
		                $scope.selectedItem, 
		                function (argument) {
			               Alerts.addAlert("success", "User updated!");
			               $scope.selectedItem.role = selectedRole;
			               $scope.newUser = false;
		            }, function (err) {
		                Alerts.addAlert("warning", "Error");
		            });
		        }
		    }

		}]
	}
});