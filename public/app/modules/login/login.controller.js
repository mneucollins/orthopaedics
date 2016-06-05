angular.module('loginModule')
.controller('loginCtrl', ['$scope', '$location', '$modal','AuthService', 'Alerts', 'User',
	function($scope, $location, $modal, AuthService, Alerts, User) {

    $("nav").addClass("hidden");
    $("body").addClass("body-login");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    var theUser;
    $scope.panelStatus = 'login';
    $scope.securityQuestions = [
        // "Who was your first kiss?",
        "Who was your favorite teacher in school?",
        "What was the first concert you attended?",
        "What is your mother's maiden name?",
        "What was the name of your first pet?",
        "What street did you grow up on?"
    ];

    $scope.login = function () {
        AuthService.login($scope.user, function(user) {

            if(!user.securityQuestion){
                theUser = user;
                $scope.panelStatus = 'completeProfile';
                return;
            }

            goToDashboard(user);

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.signup = function () {

        if($scope.user.password != $scope.user.passwordRepeat) {
            Alerts.addAlert("warning", "passwords must match!");
            return;
        }

        if(!$scope.user.name
        || !$scope.user.department
        || !$scope.user.email
        || !$scope.user.username
        || !$scope.user.password
        // || ($scope.user.isPhysician && !$scope.user.npi)
        || !$scope.user.securityQuestion
        || !$scope.user.securityAnswer) {

            Alerts.addAlert("warning", "Please fill all fields");
            return;
        }

        // if($scope.user.isPhysician && !$scope.user.npi)

        delete $scope.user.passwordRepeat;
        $scope.user.email = $scope.user.email.toLowerCase();
        $scope.user.username = $scope.user.username.toLowerCase();

        AuthService.signup($scope.user, function(user) {

            // goToDashboard(user);
            $scope.panelStatus = 'afterSignup';

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.completeProfile = function () {
        User.setSecurityQuestions({userId: theUser._id}, {
            email: $scope.user.email, 
            securityQuestion: $scope.user.question, 
            securityAnswer: $scope.user.answer
        }, function(user) {
            if(!user) {
                Alerts.addAlert("warning", "There was an error saving the user");
                return;
            }
            
            goToDashboard(user);

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    $scope.passwordRetrieval = function () {
        User.retrievePassword({}, {email: $scope.user.email}, 
        function(user) {
            Alerts.addAlert("success", "Please check your email");

        }, function (err) {
            Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
        });
    };

    function goToDashboard (user) {
        Alerts.addAlert("success", "Welcome " + user.name);

        // if(user.role == "Imaging" || user.role == "Receptionist")
        //     $location.path("/dashboard1");
        // else
        //     $location.path("/dashboard2");
        $location.path("/dashboard");
    }

    // E-Mail Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // $scope.openHelpModal = function () {

    //     var modalInstance = $modal.open({
    //         templateUrl: '/partials/sendMail.html',
    //         controller: 'sendEmailCtrl',
    //         resolve: {
    //             messageType: function () {
    //                 return "help";
    //             }
    //         }
    //     });

    //     modalInstance.result.then(function () {
    //         $log.info('Help message sent!');
    //     }, function () {
    //         $log.info('Help Modal dismissed at: ' + new Date());
    //     });  
    // }

}]);