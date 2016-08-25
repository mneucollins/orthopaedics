angular.module('kioskModule')
.controller('confirmPatientCtrl', ['$scope', '$modalInstance', '$log', 'Messages', 'Patient', 'Alerts', 'patient',
  function($scope, $modalInstance, $log, Messages, Patient, Alerts, patient) {

    $scope.denial = false;

    $scope.retry = function () {
        $modalInstance.dismiss('retry');
    }

    // $scope.denied = function () {
    //     $modalInstance.close({msgStatus: false});
    // }

    $scope.confirmed = function() {

        Patient.updCellphone({},{patientId: patient._id, cellphone: patient.cellphone}, function(patient){
            if(patient) {
                // Alerts.addAlert("success", "Preregister complete, please continue to the waiting room");
                $modalInstance.close({msgStatus: true});
            } else {
                Alerts.addAlert("warning", "Preregister could not be completed, please try again");
            }
            
        }, function(err){
            $log.info('error in dtabase');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);