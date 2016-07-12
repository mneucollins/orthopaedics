angular.module('patientRowModule')
.directive('labsColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			isLabs : "="
		},
		templateUrl : '/app/modules/patient-row/labs-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // Imaging Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.getLabsState = function (patient){
		        var labsStateIcon = "";

		        if(patient.needsLabs)
		            if(patient.labsTimestamp) {
		                labsStateIcon = "/img/ok1icon-labs.png";  
		            }
		            else {
		                labsStateIcon = "/img/yicon-labs.png";
		            }
		        else
		            labsStateIcon = "/img/nicon.png";
		        
		        return labsStateIcon;
		    }

		    $scope.toogleLabsState = function (patient){
		        if(patient.labsTimestamp){
		            var resp = confirm("Are you sure you would like to mark labs as incomplete?");
		            if (resp == true) {
		                Patient.update({patientId: patient.id}, {needsLabs: true, labsTimestamp: null}, patientLabsUpdateConfirmation);       
		            }
		        }

		        if(!$scope.isLabsClickable(patient)) return;

		        if(patient.needsLabs)
		        {
		            Patient.update({patientId: patient.id}, {needsLabs: false, labsRequestedTimestamp: null, labsStartedTimestamp: null}, patientLabsUpdated);
		        }
		        else
		        {
		            Patient.update({patientId: patient.id}, {needsLabs: true, labsRequestedTimestamp: new Date()}, patientLabsUpdated);
		        }
		        
		        function patientLabsUpdateConfirmation(updatedPatient){
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.needsLabs = updatedPatient.needsLabs;
		            $scope.patient.labsTimestamp = updatedPatient.labsTimestamp;
		        }

		        function patientLabsUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.needsLabs = updatedPatient.needsLabs;
		        }
		    }    

		    $scope.isLabsClickable = function (patient) {
		        if(patient.needsLabs && patient.labsTimestamp)
		            return false;
		        else if(patient.currentState == "DC")
		            return false;
		        else
		            return true;
		    }

		    $scope.getLabsgMinutes = function (patient) {

		        if(!patient.labsStartedTimestamp) return 0;

		        var labsIniDate = new Date(patient.labsStartedTimestamp).getTime();
		        var labsEndDate = new Date(patient.labsTimestamp).getTime();
		        var nowDate = new Date().getTime();

		        var labsTime = 0;

		        if(patient.labsTimestamp)
		            labsTime = labsEndDate - labsIniDate;
		        else
		            labsTime = nowDate - labsIniDate;

		        return Math.round(labsTime / (60*1000));
		    }

		    $scope.isLabsStarted = function (patient) {
		        return !!patient.labsStartedTimestamp;
		    }


		    $scope.completeLabsState = function (patient){

		        Patient.update({patientId: patient.id}, {labsTimestamp: new Date()}, function (updatedPatient) {
		            //var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.labsTimestamp = updatedPatient.labsTimestamp;
		        });
		    }

		    $scope.startLabs = function (patient) {
		        Patient.update({patientId: patient.id}, {labsStartedTimestamp: new Date()}, function (updatedPatient) {
		            //var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.labsStartedTimestamp = updatedPatient.labsStartedTimestamp;
		        });
		    }

		}]

	};
});