(function () {
	'use strict';

	angular
		.module("patientsModule")
		.factory('PatientStoreService', PatientStoreService);

	PatientStoreService.$inject = ['$interval', 'PhysicianListService', 'WaitTime', 'Physician']; 
	function PatientStoreService($interval, PhysicianListService, WaitTime, Physician){

		var patientList = [];
		var sortValue = 'appt-time-column';
		var isReverseOrder = false;

        $interval(retrievePatients, 5 * 60 * 1000);

		return {
			addPatient: addPatient,
			getPatientList: getPatientList,
			getPatientById: getPatientById,
			getPatientByIndex: getPatientByIndex,
			retrievePatients: retrievePatients,
			updatePatient: updatePatient,
			orderList: orderList
		};

		/////////////

		function addPatient(patient) {
			patientList.push(patient);
			orderList(sortValue, isReverseOrder);
		}

		function getPatientList() {
			return patientList;
		}

		function getPatientById(patientId) {
			return _.find(patientList, function (patient) {
				return patient._id == patientId;
			});
		}

		function getPatientByIndex(patientId) {
			if(index < patientList.length)
				return patientList[index];
			else
				return undefined;
		}

		function retrievePatients () {
			patientList = [];
			var physicians = PhysicianListService.getPhysicianList();
	        var physicianIds = _.pluck(physicians, "_id");

	        Physician.getPatientsTodayByList({physicians: physicianIds}, function (patients) {
	            _.each(patients, function (element) {
	                element.messageSelectorPos = 1;
	                // Patient.getHistory({patientId: list[index].id}, function (history) {
	                //     if (history && history.length > 0){
	                //         list[index].history = history;
	                //         list[index].previousDate = history[0];
	                //     }
	                // });
	            });
	            patientList = patientList.concat(patients);
	            // $scope.filteringActive($scope.colFilter, 0);

	            // patientList = _.sortBy(patientList, function(patient){ 
	            // 	return new Date(patient.apptTime).getTime(); 
	            // });
	            orderList(sortValue, isReverseOrder);
	        });
		}

		function updatePatient(updPatient) {
        	loadExistingPatient (updPatient, true);
		}

		function loadExistingPatient (updPatient, recurrent) {  
            var listPatient = _.find(patientList, function(patient){ 
                return patient.id == updPatient.id; 
            });

            if(listPatient) {
	            var index = patientList.indexOf(listPatient);
            	if(!_.isObject(updPatient.physician)) {
	                updPatient.physician = patientList[index].physician;
            	}
                patientList[index] = updPatient; 
                return true;
            }
            else {
                if(recurrent) setTimeout(function () {
                    loadNewPatient(updPatient);
                }, 300);
                return false;
            }
        }

        function loadNewPatient (updPatient) {  

            if(!loadExistingPatient (updPatient, false)) {
                var physicianPatient = _.find(patientList, function(patient){ 
                    return patient.physician.id == updPatient.physician; 
                });

                if(physicianPatient){
                    updPatient.physician = physicianPatient.physician;
                    patientList.push(updPatient);

                    // $scope.filteringActive($scope.colFilter);
                    // $scope.filteringActive($scope.colFilter);
                    // $scope.$apply();
                }
            }
        }  

        function orderList(field, isReverse) {
	        
	        if(field) sortValue = field;
	        isReverseOrder = !!isReverse;

	        var pList;

	        switch(sortValue) {
	            case "appt-time-column":
	                pList = _.sortBy(patientList, function(patient){ return new Date(patient.apptTime).getTime(); }); 
	                break;
	            case "name-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.fullName; });
	                break;
	            case "appt-type-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.apptType; });
	                break;
	            case "physician-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.physician.name; }); 
	                break;
	            case "room-number-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.roomNumber; }); 
	                break;
	            case "pre-register-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.prIndex; }); 
	                break;
	            case 4:
	                pList = _.sortBy(patientList, function(patient){ return patient.dateBirth; });
	                break;
	            case "at-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            var counter = 0;
	                            for (var i = 0; i < patient.enterTimestamp.length; i++) {
	                                if(patient.exitTimestamp[i])
	                                    counter += (new Date(patient.exitTimestamp[i])).getTime() - 
	                                                    (new Date(patient.enterTimestamp[i])).getTime();
	                                else
	                                    counter += (new Date()).getTime() - (new Date(patient.enterTimestamp[i])).getTime();
	                            }
	                            return new Date(counter);
	                        });
	                break;
	            case "age-column":
	                pList = _.sortBy(patientList, function(patient){ return patient.age; });
	                break;
	            case "fp-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            var counter = 0;
	                            for (var i = 0; i < patient.fpTimerEnterTimestamp.length; i++) {
	                                if(patient.fpTimerExitTimestamp[i])
	                                    counter += (new Date(patient.fpTimerExitTimestamp[i])).getTime() - 
	                                                    (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
	                                else
	                                    counter += (new Date()).getTime() - (new Date(patient.fpTimerEnterTimestamp[i])).getTime();
	                            }
	                            return new Date(counter);
	                        });
	                break;
	            case "imaging-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            if(patient.needsImaging)
	                                if(patient.imagingTimestamp)
	                                    return 3;   
	                                else
	                                    return 2;
	                            else
	                                return 1;   
	                        }); 
	                break;
	            case "fc-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            if(!patient.fcStartedTimestamp)
	                                return 1;   
	                            else if(!patient.fcFinishedTimestamp)
	                                return 2; 
	                            else 
	                                return 3;
	                        }); 
	                break;
	            case "labs-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            if(patient.needsLabs)
	                                if(patient.labsTimestamp)
	                                    return 3;   
	                                else
	                                    return 2;
	                            else
	                                return 1;   
	                        }); 
	                break;
	            case "wait-status-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            var wrt = WaitTime.getWRTime(patient);
	                            var ext = WaitTime.getEXTime(patient);
	                            return wrt + ext; 
	                        }); 
	                break;
	            case "wait-total-column":
	                pList = _.sortBy(patientList, function(patient){ 
	                            return WaitTime.getTotalTime(patient); 
	                        }); 
	                break;
	        }

	        if(isReverseOrder)
	            patientList = pList.reverse();
	        else
	            patientList = pList;
        }
	}
})();