
angular.module('messagesModule')
.controller('sendMessageCtrl', ['$scope', '$modalInstance', 'Messages', 'Alerts', 'patient', 'messageType',
  function($scope, $modalInstance, Messages, Alerts, patient, messageType) {

    $scope.patient = patient;
    if(messageType != "Bulk") {

        var messageCache = "";
        $scope.messageType = messageType;
        var localStorageKey = $scope.messageType + patient.physician._id;
        var localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

        if(localStorageValue) {
            var dateNow = new Date();
            dateNow.setHours(0);
            dateNow.setMinutes(0);
            dateNow.setSeconds(0);
            
            if(Math.abs(dateNow.getTime() - new Date(localStorageValue.date).getTime()) > 1000) {
                localStorage.removeItem(localStorageKey);
                localStorageKey = null;
                localStorageValue = null;
            }
            else {
                messageCache = localStorageValue.msj;
            }
        }

        $scope.patientMessage = messageCache;
    }

    $scope.sendMessage = function () {

        if(messageType == "Bulk") {
            Messages.sendBulkMessages({
                patient: patient,
                message: $scope.patientMessage
            }, function messageSent (sentMessage) {
                // Alerts.addAlert("success", "message sent");
            });
            Alerts.addAlert("success", "message sent");
            $modalInstance.close();
        }
        else {
            Messages.sendMessage({
                patient: patient,
                message: $scope.patientMessage
            }, function messageSent (sentMessage) {
                // Alerts.addAlert("success", "message sent!");
            });
            
            var localStorageValue = localStorage.getItem(localStorageKey);
            if (!localStorageValue) {
                var cacheDate = new Date();
                cacheDate.setHours(0);
                cacheDate.setMinutes(0);
                cacheDate.setSeconds(0);

                localStorageValue = {
                    msj: $scope.patientMessage,
                    date: cacheDate
                };
                localStorage.setItem(localStorageKey, JSON.stringify(localStorageValue));
            }

            Alerts.addAlert("success", "message sent");
            $modalInstance.close($scope.patient.roomNumber);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);