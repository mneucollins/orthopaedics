angular.module('usersModule')
.directive('userLayout',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/users/user-layout.html',
		controller:['$scope', '$timeout', 'LayoutService', 'AuthService', 'DashboardService', 'User', 'Alerts',
			function($scope, $timeout, LayoutService, AuthService, DashboardService, User, Alerts){


			$scope.items1 = [];
			$scope.items2 = [];

			$timeout(function(){
				$scope.layout = LayoutService.getLayoutUser();
				$scope.items2 = LayoutService.getActiveColumns();

				$scope.items1 = LayoutService.getInactiveColumns();

			} , 500);

			$scope.save = function(){

				var user = AuthService.currentUser();

				var newUser = {isCustomLayout:true, layout:{}};

				var newLayout = $scope.layout;
				newLayout.columns = [];

				for(var i in $scope.items2){
					newLayout.columns.push($scope.items2[i].name);
				}



				newUser.layout = newLayout;

				User.update({userId: user._id}, 
	            	newUser, 
	                function (argument) {
	               		Alerts.addAlert("success", "your layout has been updated!");
	               		DashboardService.retrieveClinicDelays();
	            	}, function (err) {
	                	Alerts.addAlert("warning", "Error");
	            });



			};

			$scope.restore = function(){

				var user = AuthService.currentUser();

				var newUser = {isCustomLayout:false};


				User.update({userId: user._id}, 
	            	newUser, 
	                function (argument) {
	               		Alerts.addAlert("success", "your layout has been updated!");
	            	}, function (err) {
	                	Alerts.addAlert("warning", "Error");
	            });



			};



		}]

	};
});

