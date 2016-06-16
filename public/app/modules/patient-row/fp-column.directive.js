angular.module('patientRowModule')
.directive('fpColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/fp-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // FC Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.getFPIcon = function (patient){
		        var FPStateIcon = "";

		        if(!patient.fpStartedTimestamp) {
		            FPStateIcon = "/img/fc-inactive.svg";  
		        }
		        else if(!patient.fpFinishedTimestamp) {
		            FPStateIcon = "/img/fc-active.svg";
		        }
		        else {
		            FPStateIcon = "/img/fc-complete.svg";
		        }
		        
		        return FPStateIcon;
		    }

		    $scope.showFPMinutes = function (patient) {
		        
		        if(patient.fpFinishedTimestamp) 
		            return false;

		        var mins = $scope.getFPMinutes(patient);
		        return mins >= 15;

		    }

		    $scope.getFPMinutes = function (patient) {

		        if(!patient.fpStartedTimestamp) return 0;

		        var fpIniDate = new Date(patient.fpStartedTimestamp).getTime();
		        var nowDate = new Date().getTime();

		        var fpTime = nowDate - fpIniDate;

		        return Math.round(fpTime / (60*1000));
		    }

		    $scope.toogleFPState = function (patient){

		        if(!$scope.isFPClickable(patient)) return;

		        if(!patient.fpStartedTimestamp) {
		            Patient.update({patientId: patient.id}, {fpStartedTimestamp: new Date()}, patientFPUpdated);
		        }
		        else if(!patient.fpFinishedTimestamp) {
		            Patient.update({patientId: patient.id}, {needsFP: true, fpFinishedTimestamp: new Date()}, patientFPUpdated);
		        }
		        else {
		            var resp = confirm("Are you sure you would like to mark FP as incomplete?");
		            if (resp == true) {
		                Patient.update({patientId: patient.id}, {fpFinishedTimestamp: null}, patientFPUpdated);       
		            }
		        }

		        function patientFPUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.fpStartedTimestamp = updatedPatient.fpStartedTimestamp;
		            $scope.patient.fpFinishedTimestamp = updatedPatient.fpFinishedTimestamp;
		        }
		    }

		    $scope.isFPClickable = function (patient) {
		        if (patient.currentState == "WR" || patient.currentState == "NCI")
		            return true;
		        else
		            return false;
		    }

		    
			
		}]

	};
});