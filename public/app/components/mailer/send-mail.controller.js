
angular.module("appCommons")
.controller('sendEmailCtrl', ['$scope', '$modalInstance', 'Emails', 'Alerts', 'messageType',
  function($scope, $modalInstance, Emails, Alerts, messageType) {

    $scope.messageType = messageType;
    $scope.mailSender = {};
    
    $scope.sendMail = function () {

        if(messageType == "help")
            Emails.sendHelpMail({
                name: $scope.mailSender.name,
                email: $scope.mailSender.email,
                subject: $scope.mailSender.subject,
                mailBody: $scope.mailSender.message
            }, function emailSent (sentMessage) {
                $scope.mailSender = {};
                $modalInstance.close();
                Alerts.addAlert("success", "message sent");
            });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);