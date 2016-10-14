angular.module('adminModule')
.directive('physicianGroupConfig',function(){
    return {
        replace : true,
        restrict : 'E',
        templateUrl : '/app/modules/admin-panel/physician-group-config.html',
        controller:['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'PhysicianFrontDeskGroup',
        function($scope, $rootScope, $modal, $log, Config, Alerts, PhysicianFrontDeskGroup) {


            $scope.savePhyGroupChanges = savePhyGroupChanges;

            ///////////////////
            
            $scope.$on("selectedPhysiciansChanged", function (ev, phyList) {
                $scope.auxItem.physicians = phyList;
            });

            function savePhyGroupChanges () {
                if($scope.newUser == true)
                {
                    PhysicianFrontDeskGroup.save($scope.auxItem, 
                       function (argument) {
                       Alerts.addAlert("success", "Physician Group created!");
                       $scope.resultPhys.push($scope.auxItem);
                       $scope.newUser = false;
                    }, function (err) {
                        Alerts.addAlert("warning", "Error");
                    });
                }
                else
                {
                    PhysicianFrontDeskGroup.update({physicianGroupId: $scope.auxItem._id}, 
                        $scope.auxItem, 
                        function (argument) {
                       $scope.selectedItem = $scope.auxItem;
                       Alerts.addAlert("success", "Physician Group updated!");
                       $scope.newUser = false;
                    }, function (err) {
                        Alerts.addAlert("warning", "Error");
                    });
                }
            }

        }]
    }
});