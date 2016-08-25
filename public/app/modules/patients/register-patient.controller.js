angular.module('patientsModule')
.controller('registerPatientCtrl', ['$scope', '$modalInstance', 'Messages', 'Patient', 'Alerts', 'PhysicianListService', 'patient', 'modalFunction',
  function($scope, $modalInstance, Messages, Patient, Alerts, PhysicianListService, patient, modalFunction) {

    var physicians = PhysicianListService.getPhysicianList();
    $scope.physicians = physicians;
    $scope.modalFunction = modalFunction;
    $scope.apptTimeLabel = {};
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    if(modalFunction == "register") {
        
        $scope.fieldsDisabled = true;

        patient.physician = _.find(physicians, function (physician) {
            return physician._id == patient.physician._id;
        });
        $scope.patient = patient;
    }
    else if(modalFunction == "new") {

        $scope.fieldsDisabled = false;
        $scope.apptTimeLabel = {"padding-top": "2.5em"};

        var apptDateObj = new Date();
        var mins = apptDateObj.getMinutes();
        apptDateObj.setMinutes(Math.round(mins/10)*10);
        $scope.patient = {
            apptTime: apptDateObj
        }
    } 
    else if(modalFunction == "edit") {

        $scope.fieldsDisabled = false;
        $scope.apptTimeLabel = {"padding-top": "2.5em"};

        patient.physician = _.find(physicians, function (physician) {
            return physician._id == patient.physician._id;
        });
        $scope.patient = patient;
    }

    $scope.submit = function () {
        if(modalFunction == "register"){

            if($scope.patient.noPhone || !$scope.patient.cellphone) {
                $scope.patient.noPhone = true;
                $modalInstance.close($scope.patient);
                Alerts.addAlert("success", "no phone number - welcome message not sent");
            }
            else {
                Messages.sendWelcomeMessage({
                    patient: $scope.patient
                }, function messageSent (sentMessage) {
                    // Alerts.addAlert("success", "welcome message sent!");
                });
                $modalInstance.close($scope.patient);
                Alerts.addAlert("success", "welcome message sent");
            }
        }
        else if(modalFunction == "new"){
            var patientToSave = $scope.patient;
            patientToSave.physician = $scope.patient.physician._id;
            patientToSave.currentState = "NCI";
            patientToSave.noPhone = !($scope.patient.cellphone);
            if(!patientToSave.apptTime) patientToSave.apptTime = new Date();

            Patient.save(patientToSave, function (newPatient) {
                newPatient.physician = _.find(physicians, function (physician) {
                    return physician._id == newPatient.physician;
                });
                Alerts.addAlert("success", "Patient Registered");
                $modalInstance.close(newPatient);
            });
        }
        else if(modalFunction == "edit"){
            var patientToSave = $scope.patient;
            patientToSave.physician = $scope.patient.physician._id;
            patientToSave.noPhone = !($scope.patient.cellphone);
            if(!patientToSave.apptTime) patientToSave.apptTime = new Date();

            Patient.update({patientId: $scope.patient._id}, patientToSave, function (newPatient) {
                newPatient.physician = _.find(physicians, function (physician) {
                    return physician._id == newPatient.physician;
                });
                Alerts.addAlert("success", "Patient Saved");
                $modalInstance.close(newPatient);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openDOB = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dobOpened = true;
    };

}]);