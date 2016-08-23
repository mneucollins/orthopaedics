angular.module('adminModule')
.directive('userConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/user-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'User',
		function($scope, $rootScope, $modal, $log, Config, Alerts, User) {

			


			$scope.saveUserChanges = function () {
				var selectedRole = $scope.selectedItem.role;
		        $scope.selectedItem.role = $scope.selectedItem.role._id;

		        if($scope.newUser == true)
		        {
		            User.save($scope.selectedItem, 
		               function (argument) {
		               Alerts.addAlert("success", "User created!");
		               $scope.selectedItem.role = selectedRole;
		                $scope.result.push($scope.selectedItem);
		               $scope.newUser = false;
		            }, function (err) {
		                Alerts.addAlert("warning", "Error");
		            });
		        }
		        else
		        {
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