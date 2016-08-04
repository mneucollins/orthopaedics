angular.module('adminModule')
.directive('roleConfig',function(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/role-config.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'Role',
		function($scope, $rootScope, $modal, $log, Config, Alerts, Role) {

			// $scope.items1 = [];
			// $scope.items2 = [];

			$scope.saveRoleChanges = function () {
				var savingRole = $scope.selectedItem;

				var newLayout = $scope.layout;
				newLayout.columns = [];
				for(var i in $scope.items2){
					newLayout.columns.push($scope.items2[i].name);
				}
				savingRole.layout = newLayout;

				$log.info(JSON.stringify(savingRole));

		        if($scope.newUser == true) {
		            Role.save(savingRole, 
		               function (argument) {
		               Alerts.addAlert("success", "Role created!");
		               $scope.newUser = false;
		            }, function (err) {
		                Alerts.addAlert("warning", "Error");
		            });
		        }
		        else
		        {
		            Role.update({roleId: savingRole._id}, 
		                savingRole, 
		                function (argument) {
			               Alerts.addAlert("success", "Role updated!");
			               $scope.newUser = false;
		            }, function (err) {
		                Alerts.addAlert("warning", "Error");
		            });
		        }
		    }
		}]
	}
});