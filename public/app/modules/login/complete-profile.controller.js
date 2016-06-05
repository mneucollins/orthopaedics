angular.module('loginModule')
.controller('completeProfileCtrl', ['$scope', '$location', 'AuthService', 'Alerts',
    function($scope, $location, AuthService, Alerts) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $scope.panelStatus = 'completeProfile';

    $scope.completeProfile = function () {
        AuthService.login($scope.user, function(user) {
            Alerts.addAlert("success", "Welcome " + user.name);

            // if(user.role == "Imaging" || user.role == "Receptionist")
            //     $location.path("/dashboard1");
            // else
            //     $location.path("/dashboard2");

            $location.path("/dashboard");

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };
}]);