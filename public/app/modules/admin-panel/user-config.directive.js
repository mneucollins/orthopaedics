angular
	.module('adminModule')
	.directive('userConfig', userConfigDirective);

function userConfigDirective(){
	return {
		replace : true,
		restrict : 'E',
		templateUrl : '/app/modules/admin-panel/user-config.html',
		controller: userConfigDirectiveController
	};

	userConfigDirectiveController.$inject = ['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'User'];
	function userConfigDirectiveController($scope, $rootScope, $modal, $log, Config, Alerts, User) {

		$scope.saveUserChanges = saveUserChanges;
        $scope.cancelChanges = cancelChanges;

		function saveUserChanges() {

	  		if(!$scope.auxItem.name || !$scope.auxItem.username) {
                Alerts.warn("Please enter at least a name and a username");
                return;
            }
            if(!validateEmail($scope.auxItem.email)) {
                Alerts.warn("Please enter a valid email");
                return;
            }

	        if($scope.isNew == true) {
	            User.save($scope.auxItem, 
	               function (argument) {
	               Alerts.addAlert("success", "User created!");
	               // $scope.selectedItem.role = selectedRole;
	               $scope.result.push($scope.auxItem);
	               $scope.isNew = false;
		           $scope.isEditing = false;
	               $scope.$broadcast("recargarLista");
	            }, function (err) {
	                Alerts.addAlert("warning", "Error");
	            });
	        } 
	        else {
	            User.update({userId: $scope.auxItem._id}, 
	                $scope.auxItem, 
	                function (argument) {
		                Alerts.addAlert("success", "User updated!");
		                // $scope.selectedItem.role = selectedRole;
		                $scope.isEditing = false;
		                var indx = _.findIndex($scope.result, {_id: $scope.auxItem._id});
		                $scope.result[indx] = $scope.auxItem;
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

	    function validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
		}

	    //////////////////////////////

	    $scope.$on('listado', function(event, args){
            
            $scope.isNew = jQuery.isEmptyObject(args.listado);
            $scope.auxItem = angular.copy(args.listado);
            if($scope.isNew)
            	$scope.auxItem.isActive = true;
	    });
	}
}