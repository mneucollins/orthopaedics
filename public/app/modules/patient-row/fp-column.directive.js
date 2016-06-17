angular.module('patientRowModule')
.directive('fpColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			patientList : "="
		},
		templateUrl : '/app/modules/patient-row/fp-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // Attending Entry Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.toogleFPEntry = function (patient) {
		        if(patient.currentState != 'EX') return;

		        if(patient.fpTimerEnterTimestamp.length > patient.fpTimerExitTimestamp.length){
		            patient.fpTimerExitTimestamp.push(new Date());
		            Patient.update({patientId: patient.id}, {fpTimerExitTimestamp: patient.fpTimerExitTimestamp}, patientFPUpdated);
		        }
		        else {
		            patient.fpTimerEnterTimestamp.push(new Date());
		            Patient.update({patientId: patient.id}, {fpTimerEnterTimestamp: patient.fpTimerEnterTimestamp}, patientFPUpdated);
		            _.each($scope.patientList, function (ptnt, index, list) {
		                if(patient.physician._id === ptnt.physician._id && 
		                patient._id != ptnt._id && 
		                ptnt.fpTimerEnterTimestamp.length > ptnt.fpTimerExitTimestamp.length) {
		    
		                    ptnt.fpTimerExitTimestamp.push(new Date());
		                    Patient.update({patientId: ptnt.id}, {fpTimerExitTimestamp: ptnt.fpTimerExitTimestamp}, function (updatedPatient) {
		                        $scope.patientList[index].fpTimerExitTimestamp = updatedPatient.fpTimerExitTimestamp;
		                    });
		                }
		            });
		        }

		        function patientFPUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.fpTimerEnterTimestamp = updatedPatient.fpTimerEnterTimestamp;
		            $scope.patient.fpTimerExitTimestamp = updatedPatient.fpTimerExitTimestamp;
		        }
		    } 

		    $scope.getFPTimer = function (patient) {

		        var counter = 0;
		        for (var i = 0; i < patient.fpTimerEnterTimestamp.length; i++) {
		            if(patient.fpTimerExitTimestamp[i])
		                counter += (new Date(patient.fpTimerExitTimestamp[i])).getTime() - (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
		            else
		                counter += (new Date()).getTime() - (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
		        };

		        var colorStateFP = "";
		        var counterAux = counter/60000;  //to minutes.
		        if(counterAux <= 15)
		            colorStateFP = "timer-on-time";
		        else if(counterAux > 15 && counterAux <= 30)
		            colorStateFP = "timer-delay-15";
		        else if(counterAux > 30 && counterAux <= 45)
		            colorStateFP = "timer-delay-30";
		        else if(counterAux > 45)
		            colorStateFP = "timer-delay-45";
		        
		        $scope.colorStateFP = colorStateFP;

		        return new Date(counter);
		    }


		    $scope.getFPIcon = function (patient) {
		        
		        if(patient.fpTimerEnterTimestamp.length == 0 || patient.currentState == 'DC')
		            return "/img/at-entry-gray.svg";
		        else if(patient.fpTimerEnterTimestamp.length > patient.fpTimerExitTimestamp.length)
		            return "/img/at-entry-green.svg";
		        else if(patient.fpTimerEnterTimestamp.length == patient.fpTimerExitTimestamp.length && patient.fpTimerEnterTimestamp.length > 0)
		            return "/img/at-entry-red.svg";
		    }


		}]

	};
});