angular.module('adminModule')
.directive('findList',function(){
	return {
		replace : true,
		restrict : 'E',
		scope: {
			listado: "="
		},
		templateUrl : '/app/modules/admin-panel/find-list.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts',
		function($scope, $rootScope, $modal, $log, Config, Alerts) {

			$scope.listado;
			$scope.findUser = "";
			
			var options2 = {
		      keys: ['name','username'],   // keys to search in
		      threshold: 0.2
		      //id: 'name'                     // return a list of identifiers only
		    }
		    	
		    setTimeout(cargarLista,300);

		    function cargarLista()
		    {
		    	$scope.result = $scope.listado;
		    	if($scope.listado == "")
		    	{
		    		setTimeout(cargarLista,300);
		    	}
		    	else
		    	{
		    		$scope.fuseUsers = new Fuse($scope.listado, options2);
		    	}
		    }

			$scope.search = function (findElement) {
		        $scope.result = $scope.fuseUsers.search(findElement);
		    }

		    $scope.newUser = function(){
		        var selectedItem = {};
		        $scope.$emit('listado', {listado: selectedItem});
		    }

		    $scope.loadRegister = function (register) {
		    	$scope.$emit('listado', {listado: register});
		    }

		    
		}]
	}
});

