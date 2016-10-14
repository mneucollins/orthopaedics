
angular.module('reportsModule')
.controller('showPhysicianSummaryCtrl', ['$scope', '$modalInstance', 'Physician',
  function($scope, $modalInstance, Physician) {

    $scope.physicians = PhysicianListService.getPhysicianList();
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };



    function activate() {
        Physician.query(function (physicians) {
            $scope.physicians = physicians;
        });
    }

    $scope.submit = function () {
        window.open("/api/reports/physician-summary?" +
            "iniDate=" + $scope.reportGen.iniDate.toISOString() +
            "&endDate=" + $scope.reportGen.iniDate.toISOString() +
            "&phySummary=" + $scope.reportGen.physician.name);
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