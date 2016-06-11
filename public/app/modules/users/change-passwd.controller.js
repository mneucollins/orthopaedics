angular.module('usersModule')
.controller('showChangePasswdCtrl', ['$scope', '$modalInstance', 'AuthService', 'Alerts', 'User',
  function($scope, $modalInstance, AuthService, Alerts, User) {

    $scope.passwd = {};

    $scope.submit = function () {

        if($scope.passwd.newPass != $scope.passwd.newConfirm) {
            Alerts.addAlert("warning", "passwords don't match!");
            return;
        }
        var currUser = AuthService.currentUser();
        User.changePassword({userId: currUser._id}, {
            oldPass: $scope.passwd.oldPass,
            newPass: $scope.passwd.newPass
        }, function (argument) {
            $modalInstance.close();
            Alerts.addAlert("success", "password changed!");
        }, function (err) {
            Alerts.addAlert("warning", "wrong password!");
            $scope.passwd.oldPass = "";
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);