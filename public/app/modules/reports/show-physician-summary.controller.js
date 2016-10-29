
angular.module('reportsModule')
.controller('showPhysicianSummaryCtrl', ['$scope', '$modalInstance', 'Physician', 'PhysicianListService', 
  function($scope, $modalInstance, Physician, PhysicianListService) {

    $scope.isLoading = false;
    $scope.physicians = PhysicianListService.getPhysicianList();
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    activate();

    function activate() {
        Physician.query(function (physicians) {
            $scope.physicians = physicians;
        });

        $scope.reportGen = {};
        $scope.reportGen.days = {};
        $scope.reportGen.days.monday = true;
        $scope.reportGen.days.tuesday = true;
        $scope.reportGen.days.wednesday = true;
        $scope.reportGen.days.thursday = true;
        $scope.reportGen.days.friday = true;
    }

    $scope.submit = function () {

        $scope.isLoading = true;
        var days = [];
        if($scope.reportGen.days.monday) days.push(1);
        if($scope.reportGen.days.tuesday) days.push(2);
        if($scope.reportGen.days.wednesday) days.push(3);
        if($scope.reportGen.days.thursday) days.push(4);
        if($scope.reportGen.days.friday) days.push(5);
        
        window.open("/api/reports/physician-summary?" +
            "iniDate=" + $scope.reportGen.iniDate.toISOString() +
            "&endDate=" + $scope.reportGen.endDate.toISOString() +
            "&daysOfWeek=" + days.join(',') +
            "&phyName=" + $scope.reportGen.physician.name);
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