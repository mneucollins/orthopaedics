angular.module('adminModule')
.directive('physicianGroupConfig', physicianGroupConfigDirective);

function physicianGroupConfigDirective (){
    return {
        replace : true,
        restrict : 'E',
        templateUrl : '/app/modules/admin-panel/physician-group-config.html',
        controller: physicianGroupConfigDirectiveController
    }

    physicianGroupConfigDirectiveController.$inject = ['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'PhysicianFrontDeskGroup'];
    function physicianGroupConfigDirectiveController($scope, $rootScope, $modal, $log, Config, Alerts, PhysicianFrontDeskGroup) {

        $scope.savePhyGroupChanges = savePhyGroupChanges;
        $scope.cancelChanges = cancelChanges;

        ///////////////////
        
        $scope.$on("selectedPhysiciansChanged", function (ev, phyList) {
            $scope.auxItem.physicians = phyList;
        });

        function savePhyGroupChanges () {
            if($scope.isNew == true)
            {
                PhysicianFrontDeskGroup.save($scope.auxItem, 
                function (argument) {
                    Alerts.addAlert("success", "Physician Group created!");
                    $scope.resultPhyGroups.push($scope.auxItem);
                    $scope.isNew = false;
                    $scope.isEditing = false;
                    $scope.$broadcast("recargarLista");
                }, function (err) {
                    Alerts.addAlert("warning", "Error");
                });
            }
            else
            {
                PhysicianFrontDeskGroup.update({physicianGroupId: $scope.auxItem._id}, $scope.auxItem, 
                function (argument) {
                    $scope.selectedItem = $scope.auxItem;
                    Alerts.addAlert("success", "Physician Group updated!");
                    $scope.isNew = false;
                    $scope.isEditing = false;
                    var indx = _.findIndex($scope.resultPhyGroups, {_id: $scope.auxItem._id});
                    $scope.resultPhyGroups[indx] = $scope.auxItem;
                    $scope.$broadcast("recargarLista");
                }, function (err) {
                    Alerts.addAlert("warning", "Error");
                });
            }
        }
    
        function cancelChanges() {
            $scope.auxItem = null;
            $scope.isNew = false;
            $scope.$parent.isEditing = false;
        }

        //////////////////////////////

        $scope.$on('listado', function(event, args){
            
            $scope.auxItem = angular.copy(args.listado);
            $scope.isNew = jQuery.isEmptyObject(args.listado);

            if($scope.auxItem.physicians)
                $scope.$broadcast('setSelectedPhysicians', $scope.auxItem.physicians);
            else
                $scope.$broadcast('setSelectedPhysicians', []);
        });
    }
}