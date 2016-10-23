angular.module('adminModule')
.directive('physicianConfig',physicianConfigDirective);

function physicianConfigDirective() {
    return {
        replace : true,
        restrict : 'E',
        templateUrl : '/app/modules/admin-panel/physician-config.html',
        controller: physicianConfigDirectiveController
    };

    physicianConfigDirectiveController.$inject = ['$scope', '$rootScope', '$modal', '$log', 'Config', 'Alerts', 'Physician'];
    function physicianConfigDirectiveController($scope, $rootScope, $modal, $log, Config, Alerts, Physician) {

        $scope.savePhysChanges = savePhysChanges;
        $scope.cancelChanges = cancelChanges;

        function savePhysChanges() {
            if(!$scope.auxItem.name || !$scope.auxItem.npi) {
                Alerts.warn("Please enter at least a name and a NPI number");
                return;
            }

            if($scope.isNew == true) {
                Physician.save($scope.auxItem, function (argument) {
                    Alerts.addAlert("success", "Physician created!");
                    $scope.resultPhys.push($scope.auxItem);
                    $scope.isNew = false;
                    $scope.isEditing = false;
                    $scope.$broadcast("recargarLista");
                }, function (err) {
                    Alerts.addAlert("warning", "Error");
                });
            }
            else {
                Physician.update({userId: $scope.auxItem._id}, $scope.auxItem, 
                function (argument) {
                    Alerts.addAlert("success", "Physician updated!");
                    $scope.isNew = false;
                    $scope.isEditing = false;
                    var indx = _.findIndex($scope.resultPhys, {_id: $scope.auxItem._id});
                    $scope.resultPhys[indx] = $scope.auxItem;
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

        $scope.$on('listado', function(event, args) {
            
            $scope.isNew = jQuery.isEmptyObject(args.listado);
            $scope.auxItem = angular.copy(args.listado);
            if($scope.isNew)
                $scope.auxItem.isActive = true;
        });

    }
}