angular.module('adminModule')
.directive('physicianConfig',function(){
    return {
        replace : true,
        restrict : 'E',
        templateUrl : '/app/modules/admin-panel/physician-config.html',
        controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'Physician',
        function($scope, $rootScope, $modal, $log, Config, Alerts, Physician) {

            $scope.savePhysChanges = function () {
                if($scope.newUser == true)
                {
                    Physician.save($scope.selectedItem, 
                       function (argument) {
                       Alerts.addAlert("success", "Physician created!");
                       //$scope.selectedItem = null;
                       $scope.newUser = false;
                    }, function (err) {
                        Alerts.addAlert("warning", "Error");
                    });
                }
                else
                {
                    Physician.update({userId: $scope.selectedItem._id}, 
                        $scope.selectedItem, 
                        function (argument) {
                       Alerts.addAlert("success", "Physician updated!");
                       //$scope.selectedItem = null;
                       $scope.newUser = false;
                    }, function (err) {
                        Alerts.addAlert("warning", "Error");
                    });
                }
            }

        }]
    }
});