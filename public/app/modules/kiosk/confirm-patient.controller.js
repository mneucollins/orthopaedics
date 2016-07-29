angular.module('kioskModule')
.controller('confirmPatientCtrl', ['$scope', '$modalInstance', '$log', 'Messages', 'Patient', 'Alerts', 'patients',
  function($scope, $modalInstance, $log, Messages, Patient, Alerts, patients) {
    $scope.patients = patients;

    $scope.confirm = function(){
        Patient.preregister({},{id: $scope.selPat.id}, function(patient){
            if(patient){
                Alerts.addAlert("success", "register complete");
            } else {
                Alerts.addAlert("warning", "register not completed");

            }
            
        }, function(err){
            $log.info('error in dtabase');
        });



        Patient.preregister({},{patientId: $scope.selPat.id}, 
            {
                currentState: "PR"
            }, 
            function patientDischarged (updatedPatient) {
                // var index = $scope.patientList.indexOf(patient); 
                // if(index >= 0) {
                //     $scope.patient.currentState = updatedPatient.currentState;
                //     $scope.patient.DCTimestamp = updatedPatient.DCTimestamp;
                //     $scope.patient.exitTimestamp = updatedPatient.exitTimestamp;
                // // }
            }
        );
        $modalInstance.close($scope.selPat);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // $scope.openDOB = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();

    //     $scope.dobOpened = true;
    // };

}]);