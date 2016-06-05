angular.module('loginModule')
.controller('restoreCtrl', ['$scope', '$location', '$routeParams', 'AuthService', 'Alerts', 'User',
    function($scope, $location, $routeParams, AuthService, Alerts, User) {

        $("nav").addClass("hidden");
        $("body").addClass("body-login");

        $scope.panelStatus = 'newPassword';
        User.getByToken({token: $routeParams.token}, function (user) {
            
            $scope.user = user;

        }, function () {
            Alerts.addAlert("danger", "Invalid token request!");
            $scope.panelStatus = 'keine';
        });

        $scope.restorePassword = function () {

            if($scope.user.password != $scope.user.passwordRepeat) {
                Alerts.addAlert("warning", "passwords must match!");
                return;
            }

            User.restorePassword({userId: $scope.user._id}, $scope.user, 
            function (user) {
                if(!user) {
                    Alerts.addAlert("warning", "There was an error updating your data. Please verify your data and try again");
                    return;
                }

                Alerts.addAlert("success", "password updated! Please log in with your new password");
                $location.path("/login");
            }, function () {
                Alerts.addAlert("warning", "There was an error updating your data. Please verify your data and try again");
            });
        };
}]);