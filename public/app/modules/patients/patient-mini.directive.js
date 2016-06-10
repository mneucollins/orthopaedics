angular.module('patientsModule')
.directive('patientMini',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {
		// 	patient : "="
		// },
		templateUrl : '/app/modules/patients/patient-mini.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts',
			function($scope, $rootScope, $modal, $log, Patient, Alerts){


		    // Patient History
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.loadPatientHistory = function (patient) {
		      Patient.getHistory({patientId: patient.id}, function (history) {
		          patient.history = history;
		      })
		    }

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
		            var index = $scope.patientList.indexOf(patient); 
		            $scope.patientList[index].enterTimestamp = updatedPatient.enterTimestamp;
		            $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
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
		            var index = $scope.patientList.indexOf(patient); 
		            $scope.patientList[index].needsImaging = updatedPatient.needsImaging;
		            $scope.patientList[index].imagingTimestamp = updatedPatient.imagingTimestamp;
		        }

		        function patientImagingUpdated (updatedPatient) {
		            var index = $scope.patientList.indexOf(patient); 
		            $scope.patientList[index].needsImaging = updatedPatient.needsImaging;
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
		            var index = $scope.patientList.indexOf(patient); 
		            $scope.patientList[index].fcStartedTimestamp = updatedPatient.fcStartedTimestamp;
		            $scope.patientList[index].fcFinishedTimestamp = updatedPatient.fcFinishedTimestamp;
		        }
		    }

		    $scope.isFCClickable = function (patient) {
		        if (patient.currentState == "WR" || patient.currentState == "NCI")
		            return true;
		        else
		            return false;
		    }

		    $scope.restoreDischargedPatient = function (patient) {
		        var resp = confirm("Are you sure you would like to restore this patient?");
		        
		        if (resp == true) {
		            Patient.update({patientId: patient.id}, 
		                {DCTimestamp: null, currentState: "EX"}, 
		                function (updatedPatient) {
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
		                        $scope.patientList[index].currentState = updatedPatient.currentState;
		                    }
		                    Alerts.addAlert("success", "Patient restored");
		                });       
		        }   
		    }

		    // State Changing
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.register = function (patient) {
		        
		        var modalInstance = $modal.open({
		            templateUrl: '/app/modules/patients/register-patient.html',
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
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].currentState = updatedPatient.currentState;
		                        $scope.patientList[index].WRTimestamp = updatedPatient.WRTimestamp;
		                        $scope.patientList[index].cellphone = updatedPatient.cellphone;
		                        $scope.patientList[index].noPhone = updatedPatient.noPhone;
		                    }

		                    setTimeout(function () {
		                        if(!patient.callbackEnabled)
		                            Patient.update({patientId: patient.id}, 
		                                {callbackEnabled: true}, 
		                                function (updatedPatient) {
		                                    var index = $scope.patientList.indexOf(patient); 
		                                    if(index >= 0) {
		                                        $scope.patientList[index].callbackEnabled = updatedPatient.callbackEnabled;
		                                    }
		                                }
		                            );
		                    }, 5 * 60 * 1000);
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
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].callbackEnabled = updatedPatient.callbackEnabled;
		                    }
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
		                        var index = $scope.patientList.indexOf(patient); 
		                        if(index >= 0) {
		                            $scope.patientList[index].currentState = updatedPatient.currentState;
		                            $scope.patientList[index].EXTimestamp = updatedPatient.EXTimestamp;
		                        }
		                    }
		                );
		            }, function () {
		                $log.info('Message Modal dismissed at: ' + new Date());
		            }); 
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
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].currentState = updatedPatient.currentState;
		                        $scope.patientList[index].DCTimestamp = updatedPatient.DCTimestamp;
		                        $scope.patientList[index].exitTimestamp = updatedPatient.exitTimestamp;
		                    }
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