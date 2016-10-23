angular
	.module('adminModule')
	.directive('roleConfig', roleConfigDirective);

function roleConfigDirective(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/role-config.html',
		controller: roleConfigDirectiveController
	}

	roleConfigDirectiveController.$inject = ['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'Role', 'LayoutService'];
	function roleConfigDirectiveController($scope, $rootScope, $modal, $log, Config, Alerts, Role, LayoutService) {

		$scope.items1 = [];
		$scope.items2 = [];

		$scope.saveRoleChanges = saveRoleChanges;
        $scope.cancelChanges = cancelChanges;

		function saveRoleChanges() {

	  		if(!$scope.auxItem.name) {
                Alerts.warn("Please enter at least a name");
                return;
            }
			var savingRole = $scope.auxItem;

			var newLayout = $scope.layout;
			newLayout.columns = [];
			for(var i in $scope.items2){
				newLayout.columns.push($scope.items2[i].name);
			}
			savingRole.layout = newLayout;

	        if($scope.isNew == true) {
	            Role.save(savingRole, 
	               	function (argument) {
	               	$scope.roles.push(savingRole);
	            	Alerts.addAlert("success", "Role created!");
	               	$scope.isNew = false;
		            $scope.isEditing = false;
                    $scope.$broadcast("recargarLista");
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
		                $scope.isEditing = false;
		                var indx = _.findIndex($scope.roles, {_id: $scope.auxItem._id});
		                $scope.roles[indx] = $scope.auxItem;
	               		$scope.$broadcast("recargarLista");
	            }, function (err) {
	                Alerts.addAlert("warning", "Error");
	            });
	        }
	    }
    
	    function cancelChanges() {
	        $scope.auxItem = null;
	        $scope.isNew = false;
	        $scope.$parent.isEditing = false;
	    }

	    //////////////////////////////

	    $scope.$on('listado', function(event, args) {
	        
	        $scope.auxItem = angular.copy(args.listado);
	        $scope.isNew = jQuery.isEmptyObject(args.listado);

            if ($scope.auxItem.layout){
                $scope.layout = $scope.auxItem.layout;
            } 
            else {
                $scope.layout = {
                    "coloredPriorTime" : false,
                    "highlightNewPatients" : false,
                    "columns" : [ 
                        "action-column", 
                        "appt-time-column", 
                        "name-column", 
                        "wait-status-column", 
                        "wait-total-column"
                    ]
                }
            }

            $scope.items2 = LayoutService.getActiveColumns($scope.layout);
            $scope.items1 = LayoutService.getInactiveColumns($scope.layout);
	    });
	}
}