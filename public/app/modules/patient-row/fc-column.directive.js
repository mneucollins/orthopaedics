angular.module('patientRowModule')
.directive('fcColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/fc-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // FC Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.getFCIcon = function (patient){
		        var FCStateIcon = "";

		        if(!patient.fcStartedTimestamp) {
		            FCStateIcon = "/img/fc-inactive.svg";  
		        }
		        else if(!patient.fcFinishedTimestamp) {
		            FCStateIcon = "/img/fc-active.svg";
		        }
		        else {
		            FCStateIcon = "/img/fc-complete.svg";
		        }
		        
		        return FCStateIcon;
		    }

		    $scope.showFCMinutes = function (patient) {
		        
		        if(patient.fcFinishedTimestamp) 
		            return false;

		        var mins = $scope.getFCMinutes(patient);
		        return mins >= 15;

		    }

		    $scope.getFCMinutes = function (patient) {

		        if(!patient.fcStartedTimestamp) return 0;

		        var fcIniDate = new Date(patient.fcStartedTimestamp).getTime();
		        var nowDate = new Date().getTime();

		        var fcTime = nowDate - fcIniDate;

		        return Math.round(fcTime / (60*1000));
		    }

		    $scope.toogleFCState = function (patient){

		        if(!$scope.isFCClickable(patient)) return;

		        if(!patient.fcStartedTimestamp) {
		            Patient.update({patientId: patient.id}, {fcStartedTimestamp: new Date()}, patientFCUpdated);
		        }
		        else if(!patient.fcFinishedTimestamp) {
		            Patient.update({patientId: patient.id}, {needsFC: true, fcFinishedTimestamp: new Date()}, patientFCUpdated);
		        }
		        else {
		            var resp = confirm("Are you sure you would like to mark FC as incomplete?");
		            if (resp == true) {
		                Patient.update({patientId: patient.id}, {fcFinishedTimestamp: null}, patientFCUpdated);       
		            }
		        }

		        function patientFCUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.fcStartedTimestamp = updatedPatient.fcStartedTimestamp;
		            $scope.patient.fcFinishedTimestamp = updatedPatient.fcFinishedTimestamp;
		        }
		    }

		    $scope.isFCClickable = function (patient) {
		        if (patient.currentState == "WR" || patient.currentState == "NCI")
		            return true;
		        else
		            return false;
		    }

		    
			
		}]

	};
});