angular.module('kioskModule')
.controller('askCellphoneCtrl', ['$scope', '$modalInstance', '$log', 'Messages', 'Patient', 'Alerts', 'patient',
  function($scope, $modalInstance, $log, Messages, Patient, Alerts, patient) {
    $scope.patient = patient;

    $scope.confirm = function(){
        Patient.updCellphone({},{patientId: $scope.patient.id, cellphone:$scope.patient.cellphone}, function(patient){
            if(patient){
                Alerts.addAlert("success", "register complete");
            } else {
                Alerts.addAlert("warning", "register not completed");

            }
            
        }, function(err){
            $log.info('error in dtabase');
        });

        $modalInstance.close($scope.selPat);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


}]);