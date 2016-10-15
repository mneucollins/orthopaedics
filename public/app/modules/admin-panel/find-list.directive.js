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

			var options2;

			$scope.findElement = "";
			$scope.activeData = true;

		    $scope.loadRegister = loadRegister;
		    $scope.newElem = newElem;
		    $scope.toggleInactive = toggleInactive;
			$scope.search = search;

			activate();

			function activate() {

				if($scope.elemento == 'User')
					options2 = {
				    	keys: ['name','username'], // keys to search in
				    	threshold: 0.2
				    }
				else if($scope.elemento == 'Role')
					options2 = {
				    	keys: ['name'], // keys to search in
				    	threshold: 0.2
				    }
				else if($scope.elemento == 'Physician')
					options2 = {
				    	keys: ['name', 'firstName', 'lastName', 'department', 'email', 'npi'], // keys to search in
				    	threshold: 0.2
				    }
				else if($scope.elemento == 'Physician Group')
					options2 = {
				    	keys: ['name'], // keys to search in
				    	threshold: 0.2
				    }

			    	
			    setTimeout(cargarLista, 300);
			}

		    function cargarLista() {

		    	if($scope.listado == "") {
		    		setTimeout(cargarLista, 300);
		    	} else {
		    		$scope.fuseList = new Fuse($scope.listado, options2);
		    		search();
		    	}
		    }

			function search() {
				if($scope.findElement != "")
		        	$scope.result = $scope.fuseList.search($scope.findElement);
		        else
		        	$scope.result = $scope.listado;

		        if($scope.elemento == 'User' || $scope.elemento == 'Physician') {
			        if($scope.activeData) {
			        	$scope.result = _.filter($scope.result,function(elem){
			    			return elem.isActive;
			    		});
			        }
			        else {
			        	$scope.result = _.filter($scope.result,function(elem){
			    			return !elem.isActive;
			    		});	
			        }
		        }
		    }

		    function toggleInactive() {
		    	$scope.activeData = !$scope.activeData;
		    	search();
		    }

		    function newElem() {
		        var selectedItem = {};
		        $scope.$emit('listado', {listado: selectedItem});
		    }

		    function loadRegister(register) {
		    	// $log.info(JSON.stringify(register));
		    	$scope.$emit('listado', {listado: register});
		    }
 
		}]
	}
});

