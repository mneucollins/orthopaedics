angular.module('kioskModule')
.controller('confirmPatientCtrl', ['$scope', '$modalInstance', 'Messages', 'Patient', 'Alerts', 'patients',
  function($scope, $modalInstance, Messages, Patient, Alerts, patients) {
    $scope.patients = patients;

    $scope.confirm = function(){
        // alert(JSON.stringify($scope.selPat));
        // $scope.selPat.currentState = "PR";
        // selPat.PRTimestamp.push(new Date());
        Patient.update({patientId: $scope.selPat.id}, 
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