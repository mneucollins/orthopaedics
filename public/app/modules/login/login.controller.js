angular.module('loginModule').controller('loginController',['$scope','$location',function($scope,$location){

	$scope.ingresar = function(){
		$location.path('home');
	}

}]);