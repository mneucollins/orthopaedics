angular.module('kioskModule')
.controller('kioskCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");

    var theUser;
    $scope.panelStatus = 'welcome';
    $scope.phoneStatus = false;


    $scope.final = function(phoneStatus){
        $scope.phoneStatus = phoneStatus;
        $scope.panelStatus = 'final';

        $timeout(function () {
            $scope.patient = {};
            $scope.selPat = {};
            $scope.phoneStatus = false;
            $scope.panelStatus = 'welcome';
        }, 7 * 1000);
    };

    $scope.confirm = function(){
        $scope.panelStatus = 'confirmation';

        if($scope.patients && $scope.patients.length == 1) {
            $scope.selPat = $scope.patients[0];
        }
    };

    $scope.register = function(){
        $scope.panelStatus = 'register';
    };

    $scope.return = function(){
        $scope.panelStatus = 'welcome';
    };


}]);