
angular.module("appCommons")
.controller('AlertsCtrl', ['$scope', 'Alerts',
    function ($scope, Alerts) {

        $scope.systemAlerts = Alerts.getAlerts();

        $scope.$on('alerts:updated', function (event, alerts) {
            $scope.systemAlerts = alerts;
            $scope.$apply();
        });

        $scope.closeAlert = function(index) {
            Alerts.closeAlert(index);
        };
}]);