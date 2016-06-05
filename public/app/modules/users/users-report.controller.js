
angular.module('usersModule')
.controller('usersReportCtrl', ['$scope', '$modalInstance', 'Reports',
  function($scope, $modalInstance, Reports) {

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.submit = function () {
        window.open("/api/reports/users");
        // Reports.generate($scope.reportGen, function (data) {
            $modalInstance.close();
        // });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openStartDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startDateOpened = true;
    };

    $scope.openEndDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endDateOpened = true;
    };

}]);