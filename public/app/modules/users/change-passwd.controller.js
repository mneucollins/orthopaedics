angular.module('usersModule')
.controller('showChangePasswdCtrl', ['$scope', '$modalInstance', 'Alerts',
  function($scope, $modalInstance, Alerts) {

    $scope.passwd = {};

    $scope.submit = function () {

        if($scope.passwd.newPass != $scope.passwd.newConfirm) {
            Alerts.addAlert("warning", "passwords don't match!");
            return;
        }

        // $modalInstance.close($scope.patient);
        Alerts.addAlert("success", "password changed!");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);