angular.module('kioskModule')
.controller('kioskCtrl', ['$scope',
	function($scope) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");

    var theUser;
    $scope.panelStatus = 'welcome';

    $scope.register = function(){
        $scope.panelStatus = 'register';
    };

    $scope.return = function(){
        $scope.panelStatus = 'welcome';
    };


}]);