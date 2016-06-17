angular.module('patientRowModule')
.directive('atColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			patientList : "="
		},
		templateUrl : '/app/modules/patient-row/at-column.html',
		controller:['$scope', 'Patient', function($scope, Patient){

		    // Attending Entry Management
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.toogleATEntry = function (patient) {
		        if(patient.currentState != 'EX') return;

		        if(patient.enterTimestamp.length > patient.exitTimestamp.length){
		            patient.exitTimestamp.push(new Date());
		            Patient.update({patientId: patient.id}, {exitTimestamp: patient.exitTimestamp}, patientATUpdated);
		        }
		        else {
		            patient.enterTimestamp.push(new Date());
		            Patient.update({patientId: patient.id}, {enterTimestamp: patient.enterTimestamp}, patientATUpdated);
		            _.each($scope.patientList, function (ptnt, index, list) {
		                if(patient.physician._id === ptnt.physician._id && 
		                patient._id != ptnt._id && 
		                ptnt.enterTimestamp.length > ptnt.exitTimestamp.length) {
		    
		                    ptnt.exitTimestamp.push(new Date());
		                    Patient.update({patientId: ptnt.id}, {exitTimestamp: ptnt.exitTimestamp}, function (updatedPatient) {
		                        $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
		                    });
		                }
		            });
		        }

		        function patientATUpdated (updatedPatient) {
		            // var index = $scope.patientList.indexOf(patient); 
		            $scope.patient.enterTimestamp = updatedPatient.enterTimestamp;
		            $scope.patient.exitTimestamp = updatedPatient.exitTimestamp;
		        }
		    } 

		    $scope.getATtimer = function (patient) {

		        var counter = 0;
		        for (var i = 0; i < patient.enterTimestamp.length; i++) {
		            if(patient.exitTimestamp[i])
		                counter += (new Date(patient.exitTimestamp[i])).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
		            else
		                counter += (new Date()).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
		        };

		        var colorStateAT = "";
		        var counterAux = counter/60000;  //to minutes.
		        if(counterAux <= 15)
		            colorStateAT = "timer-on-time";
		        else if(counterAux > 15 && counterAux <= 30)
		            colorStateAT = "timer-delay-15";
		        else if(counterAux > 30 && counterAux <= 45)
		            colorStateAT = "timer-delay-30";
		        else if(counterAux > 45)
		            colorStateAT = "timer-delay-45";
		        
		        $scope.colorStateAT = colorStateAT;

		        return new Date(counter);
		    }


		    $scope.getATIcon = function (patient) {
		        
		        if(patient.enterTimestamp.length == 0 || patient.currentState == 'DC')
		            return "/img/at-entry-gray.svg";
		        else if(patient.enterTimestamp.length > patient.exitTimestamp.length)
		            return "/img/at-entry-green.svg";
		        else if(patient.enterTimestamp.length == patient.exitTimestamp.length && patient.enterTimestamp.length > 0)
		            return "/img/at-entry-red.svg";
		    }


		}]

	};
});