angular.module('messagesModule')
.controller('bulkMessageCtrl', ['$scope', '$modalInstance', '$modal', '$log', 'Messages', 'patients',
  function($scope, $modalInstance, $modal, $log, Messages, patients) {

    patients = _.filter(patients, function (patient) { return patient.cellphone; });
    $scope.patients = patients;
    $scope.orderBy = "name";

    $scope.writeMessage = function () {

        var modalInstance = $modal.open({
            templateUrl: '/app/modules/messages/send-message.dialog.html',
            controller: 'sendMessageCtrl',
            resolve: {
                patient: function () {
                    return _.filter($scope.patients, function (patient) {
                        return patient.msjSelected;
                    });
                },
                messageType: function () {
                    return "Bulk";
                }
            }
        });

        modalInstance.result.then(function () {
            $log.info('Imaging message sent!');
        }, function () {
            $log.info('Message Modal dismissed at: ' + new Date());
        });
        
        $modalInstance.close();
    };

    $scope.selectAll = function () {
        if($scope.orderBy == "name") {
            _.each($scope.patients, function (element, index, list) {
                list[index].msjSelected = $scope.allSelected;
            });
        }
        else if($scope.orderBy == "physician") {
            _.each($scope.patients, function (value, key, list) {
                _.each(value, function (element, index, pList) {
                    pList[index].msjSelected = $scope.allSelected;
                });

                list[key] = value;
            });
        }
    }

    $scope.changeOrder = function () {
        if($scope.orderBy == "name") {
            $scope.patients = patients;
        }
        else if($scope.orderBy == "physician") {
            $scope.patients = _.groupBy(patients, function (patient) { return patient.physician.name; });
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);