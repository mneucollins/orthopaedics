
angular.module('patientsModule')
.controller('showNotesCtrl', ['$scope', '$modalInstance', 'patients',
  function($scope, $modalInstance, patients) {

    $scope.patients = patients;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);