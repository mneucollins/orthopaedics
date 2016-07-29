angular.module('kioskModule')
.controller('confirmPatientCtrl', ['$scope', '$modalInstance', '$log', 'Messages', 'Patient', 'Alerts', 'patients',
  function($scope, $modalInstance, $log, Messages, Patient, Alerts, patients) {
    $scope.patients = patients;

    $scope.confirm = function(){
        Patient.register({},{id: $scope.selPat.id}, function(patient){
            if(patient){
                Alerts.addAlert("success", "register completed");
            } else {
                Alerts.addAlert("warning", "register not completed");

            }
            
        }, function(err){
            $log.info('error in dtabase');
        });



        Patient.register({},{patientId: $scope.selPat.id}, 
            {
                currentState: "PR",
                PRTimestamp: new Date()
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