angular.module('patientRowModule')
.directive('imagingColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/imaging-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // Imaging Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.getImagingState = function (patient){
		        var imagingStateIcon = "";

		        if(patient.needsImaging)
		            if(patient.imagingTimestamp){
		                imagingStateIcon = "/img/ok1icon.svg";  
		            }
		            else{
		                imagingStateIcon = "/img/yicon.png";
		            }
		        else
		            imagingStateIcon = "/img/nicon.png";
		        
		        return imagingStateIcon;
		    }

		    $scope.toogleImagingState = function (patient){
		        if(patient.imagingTimestamp){
		            var resp = confirm("Are you sure you would like to mark imaging as incomplete?");
		            if (resp == true) {
		                Patient.update({patientId: patient.id}, {needsImaging: true, imagingTimestamp: null}, patientImagingUpdateConfirmation);       
		            }
		        }

		        if(!$scope.isImagingClickable(patient)) return;

		        if(patient.needsImaging)
		        {
		            Patient.update({patientId: patient.id}, {needsImaging: false, imagingRequestedTimestamp: null, imagingStartedTimestamp: null}, patientImagingUpdated);
		        }
		        else
		        {
		            Patient.update({patientId: patient.id}, {needsImaging: true, imagingRequestedTimestamp: new Date()}, patientImagingUpdated);
		        }
		        
		        function patientImagingUpdateConfirmation(updatedPatient){
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.needsImaging = updatedPatient.needsImaging;
		            $scope.patient.imagingTimestamp = updatedPatient.imagingTimestamp;
		        }

		        function patientImagingUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.needsImaging = updatedPatient.needsImaging;
		        }
		    }    

		    $scope.isImagingClickable = function (patient) {
		        if(patient.needsImaging && patient.imagingTimestamp)
		            return false;
		        else if(patient.currentState == "DC")
		            return false;
		        else
		            return true;
		    }

		    $scope.getImagingMinutes = function (patient) {

		        if(!patient.imagingStartedTimestamp) return 0;

		        var imagingIniDate = new Date(patient.imagingStartedTimestamp).getTime();
		        var imagingEndDate = new Date(patient.imagingTimestamp).getTime();
		        var nowDate = new Date().getTime();

		        var imagingTime = 0;

		        if(patient.imagingTimestamp)
		            imagingTime = imagingEndDate - imagingIniDate;
		        else
		            imagingTime = nowDate - imagingIniDate;

		        return Math.round(imagingTime / (60*1000));
		    }

		    $scope.isImagingStarted = function (patient) {
		        return !!patient.imagingStartedTimestamp;
		    }

		}]

	};
});