angular.module('patientRowModule')
.directive('actionColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/action-column.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts', 'Config',
		function($scope, $rootScope, $modal, $log, Patient, Alerts, Config){

		    $scope.restoreDischargedPatient = function (patient) {
		        var resp = confirm("Are you sure you would like to restore this patient?");
		        
		        if (resp == true) {
		            Patient.update({patientId: patient.id}, 
		                {DCTimestamp: null, currentState: "EX"}, 
		                function (updatedPatient) {
		                    // var index = $scope.patientList.indexOf(patient); 
		                    // if(index >= 0) {
		                        $scope.patient.DCTimestamp = updatedPatient.DCTimestamp;
		                        $scope.patient.currentState = updatedPatient.currentState;
		                    // }
		                    Alerts.addAlert("success", "Patient restored");
		                });       
		        }   
		    }

		    // State Changing
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.register = function (patient) {
		        
		        var modalInstance = $modal.open({
		            templateUrl: '/app/modules/patients/register-patient.dialog.html',
		            controller: 'registerPatientCtrl',
		            resolve: {
		                patient: function () {
		                    return patient;
		                },
		                physicians: function () {
		                    return $rootScope.selectedPhysicians;
		                },
		                modalFunction: function () {
		                    return "register";
		                }
		            }
		        });

		        modalInstance.result.then(function (patient) {
		            Patient.update({patientId: patient.id}, 
		                {
		                    currentState: "WR",
		                    WRTimestamp: new Date(),
		                    cellphone: patient.cellphone,
		                    noPhone: patient.noPhone
		                }, 
		                function patientWaitingRoom (updatedPatient) {
		                    // var index = $scope.patientList.indexOf(patient); 
		                    // if(index >= 0) {
		                        $scope.patient.currentState = updatedPatient.currentState;
		                        $scope.patient.WRTimestamp = updatedPatient.WRTimestamp;
		                        $scope.patient.cellphone = updatedPatient.cellphone;
		                        $scope.patient.noPhone = updatedPatient.noPhone;
		                    // }

		                    setTimeout(function () {
		                        if(!$scope.patient.callbackEnabled)
		                            $scope.patient.callbackEnabled = true;
		                    }, Config.getCallbackInterval() * 60 * 1000);
		                }
		            );
		        }, function () {
		            $log.info('Message Modal dismissed at: ' + new Date());
		        });
		    }

		    $scope.callBack = function (patient) {
		        // var fcTimeElapsed = (new Date().getTime() - new Date(patient.WRTimestamp).getTime()) / (60*1000);
		        
		        if(patient.callbackEnabled) {
		            var modalInstance = $modal.open({
		                templateUrl: '/partials/sendMessage.html',
		                controller: 'sendMessageCtrl',
		                resolve: {
		                    patient: function () {
		                        return patient;
		                    },
		                    messageType: function () {
		                        return "Call";
		                    }
		                }
		            });
		        }
		        else if(patient.callbackPressed) {
		            Patient.update({patientId: patient.id}, 
		                {callbackEnabled: true}, 
		                function (updatedPatient) {
		                    // var index = $scope.patientList.indexOf(patient); 
		                    // if(index >= 0) {
		                        $scope.patient.callbackEnabled = updatedPatient.callbackEnabled;
		                    // }
		                }
		            );
		        }
		        else {
		            patient.callbackPressed = true;
		            var css = {
		                "transition": "all 3s linear",
		                "background-color": "#428bca"
		            }
		            $('.pat_' + patient._id + " .btnCallBack").css(css);

		            function disableCallback (patient) {
		                setTimeout(function () {
		                    if($('.pat_' + patient._id + " .btnCallBack").hasClass("btn-primary")) 
		                        return;

		                    patient.callbackPressed = false;
		                    var css = {
		                        "transition": "all 0.3s linear",
		                        "background-color": "#fff"
		                    }
		                    $('.pat_' + patient._id + " .btnCallBack").css(css);
		                }, 3000);
		            }
		            disableCallback(patient);
		        }

		        if(modalInstance)
		            modalInstance.result.then(function (roomNumber) {
		                Patient.update({patientId: patient.id}, 
		                    {
		                        currentState: "EX",
		                        EXTimestamp: new Date(),
		                        roomNumber: roomNumber
		                    }, 
		                    function patientExamRoom (updatedPatient) {
		                        // var index = $scope.patientList.indexOf(patient); 
		                        // if(index >= 0) {
		                            $scope.patient.currentState = updatedPatient.currentState;
		                            $scope.patient.EXTimestamp = updatedPatient.EXTimestamp;
		                        // }
		                    }
		                );
		            }, function () {
		                $log.info('Message Modal dismissed at: ' + new Date());
		            }); 
		    }

		    $scope.preRegister = function(patient){

		    	if(patient.WTRPressed){

		    		$log.info('wtr pressed');

		    		
		            Patient.update({patientId: patient.id}, {
		            	currentState : "NCI",
		            }, 
		                function (updatedPatient) {
		                    // var index = $scope.patientList.indexOf(patient); 
		                    // if(index >= 0) {
		                        $scope.patient.currentState = updatedPatient.currentState;
		                    // }
		                }
		            );
		    	} else{
		    		patient.WTRPressed = true;
		    		var css = {
		                "transition": "all 3s linear",
		                "background-color": "#428bca"
		            }
		            $('.pat_' + patient._id + " .btnCallBack").css(css);
		            function disableCallback (patient) {
		                setTimeout(function () {
		                    if($('.pat_' + patient._id + " .btnCallBack").hasClass("btn-primary")) 
		                        return;

		                    patient.WTRPressed = false;
		                    var css = {
		                        "transition": "all 0.3s linear",
		                        "background-color": "#fff"
		                    }
		                    $('.pat_' + patient._id + " .btnCallBack").css(css);
		                }, 3000);
		            }
		            disableCallback(patient);

		    	}

		    }

		    // var dischargePressed = false;
		    $scope.discharge = function (patient) {

		        if(patient.dischargePressed){
		            patient.exitTimestamp.push(new Date());
		            Patient.update({patientId: patient.id}, 
		                {
		                    currentState: "DC",
		                    DCTimestamp: new Date(),
		                    exitTimestamp: patient.exitTimestamp
		                }, 
		                function patientDischarged (updatedPatient) {
		                    // var index = $scope.patientList.indexOf(patient); 
		                    // if(index >= 0) {
		                        $scope.patient.currentState = updatedPatient.currentState;
		                        $scope.patient.DCTimestamp = updatedPatient.DCTimestamp;
		                        $scope.patient.exitTimestamp = updatedPatient.exitTimestamp;
		                    // }
		                }
		            );
		        }
		        else {
		            patient.dischargePressed = true;
		            var css = {
		                "transition": "all 3s linear",
		                "background-color": "#428bca"
		            }
		            $('.pat_' + patient._id + " .btnDischarge").css(css);

		            function disableDischarge (patient) {
		                setTimeout(function () {
		                    patient.dischargePressed = false;
		                    var css = {
		                        "transition": "all 0.3s linear",
		                        "background-color": "#fff"
		                    }
		                    $('.pat_' + patient._id + " .btnDischarge").css(css);
		                }, 3000);
		            }
		            disableDischarge(patient);
		            
		        }
		    }




		}]

	};
});