
angular.module('reportsModule')
.controller('showReportsCtrl', ['$scope', '$modalInstance', 'Reports',
  function($scope, $modalInstance, Reports) {

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.submit = function () {
        window.open("/api/reports/generate?" +
            "iniDate=" + $scope.reportGen.iniDate.toISOString() +
            "&endDate=" + $scope.reportGen.endDate.toISOString());
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