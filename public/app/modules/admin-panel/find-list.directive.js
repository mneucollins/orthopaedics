angular.module('adminModule')
.directive('findList',function(){
	return {
		replace : true,
		restrict : 'E',
		scope: {
			listado: "=",
			elemento: "=" // User, Role, Physician (might be any of these)
		},
		templateUrl : '/app/modules/admin-panel/find-list.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts',
		function($scope, $rootScope, $modal, $log, Config, Alerts) {

			$scope.listado;
			$scope.findElement = "";
			$scope.inactiveData = false;

			if($scope.elemento == 'User')
				var options2 = {
			    	keys: ['name','username'], // keys to search in
			    	threshold: 0.2
			    }
			else if($scope.elemento == 'Role')
				var options2 = {
			    	keys: ['name'], // keys to search in
			    	threshold: 0.2
			    }
			else if($scope.elemento == 'Physician')
				var options2 = {
			    	keys: ['name', 'firstName', 'lastName', 'department', 'email', 'npi'], // keys to search in
			    	threshold: 0.2
			    }
			else if($scope.elemento == 'Physician Group')
				var options2 = {
			    	keys: ['name'], // keys to search in
			    	threshold: 0.2
			    }
			
		    	
		    setTimeout(cargarLista, 300);

		    function cargarLista() {
		    	$scope.result = _.sortBy($scope.listado, function(elem){ return elem.name });
		    	if($scope.listado == "") {
		    		setTimeout(cargarLista,300);
		    	} else {
		    		$scope.fuseList = new Fuse($scope.listado, options2);
		    	}
		    }

			$scope.search = function (findElement) {
		        $scope.result = _.sortBy($scope.fuseList.search(findElement) , function(elem){ return elem.name });
		        if(!$scope.inactiveData){
		        	alert("data is inactive");
		        	$scope.result = _.filter($scope.result,function(elem){
		    			return elem.isActive;
		    		});
		        }
		    }

		    $scope.showInactive = function (findElement){
		    	if(!$scope.inactiveData){
		    		$scope.result = _.filter($scope.result,function(elem){
		    			return elem.isActive;
		    		});
		    	} else {
		    		$scope.result = _.sortBy($scope.fuseList.search(findElement) , function(elem){ return elem.name });
		    	}
		    }

		    $scope.newElem = function(){
		        var selectedItem = {};
		        $scope.$emit('listado', {listado: selectedItem});
		    }

		    $scope.loadRegister = function (register) {
		    	// $log.info(JSON.stringify(register));
		    	$scope.$emit('listado', {listado: register});
		    }
 
		}]
	}
});

