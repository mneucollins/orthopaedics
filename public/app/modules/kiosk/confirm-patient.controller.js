angular.module('kioskModule')
.controller('confirmPatientCtrl', ['$scope', '$modalInstance', '$log', 'Messages', 'Patient', 'Alerts', 'patients',
  function($scope, $modalInstance, $log, Messages, Patient, Alerts, patients) {
    $scope.patients = patients;

    $scope.confirm = function(){
        Patient.preregister({},{patientId: $scope.selPat.id}, function(patient){
            if(patient){
                $log.info('register complete');
            } else {
                Alerts.addAlert("warning", "your register could not be completed, please try again");

            }
            
        }, function(err){
            $log.info('error in dtabase');
        });

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