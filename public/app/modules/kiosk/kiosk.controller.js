angular.module('kioskModule')
.controller('kioskCtrl', ['$scope', '$timeout', '$interval',
	function($scope, $timeout, $interval) {

    var theUser;
    $scope.theTime = new Date();
    $scope.messageTries = 0;
    $scope.panelStatus = 'welcome';
    $scope.phoneStatus = false;

    $scope.final = final;
    $scope.confirm = confirm;
    $scope.register = register;     
    $scope.return = returnFunction;

    activate();

    //////////////

    function activate(argument) {
        $("body").css({"padding-top": 0});
        $("body").addClass("body-kiosk");

        var dateInterval = $interval(function() {
            $scope.theTime = new Date();
        }, 1000);

        $scope.$on("$destroy", function () {
            $interval.stop(dateInterval);
        });
    }

    function final (phoneStatus){
        $scope.phoneStatus = phoneStatus;
        $scope.panelStatus = 'final';
        $scope.messageTries = 0;

        $timeout(function () {
            $scope.patient = {};
            $scope.selPat = {};
            $scope.phoneStatus = false;
            $scope.panelStatus = 'welcome';
        }, 7 * 1000);
    };


    function confirm(){
        $scope.panelStatus = 'confirmation';
        $scope.messageTries = 0;

        if($scope.patients && $scope.patients.length == 1) {
            $scope.selPat = $scope.patients[0];
        }
    };

    function register(){
        $scope.panelStatus = 'register';
        $scope.messageTries = 0;
    };

    function returnFunction(){
        $scope.panelStatus = 'welcome';
        $scope.messageTries = 0;
    };


}]);