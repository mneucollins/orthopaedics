
angular.module("appCommons")
.directive('appNavbar', function(){
	return {
	    replace: true,
	    restrict:'E',
	    scope: {
	    },
	    templateUrl: '/app/components/navbar/navbar.html',
	    controller:['$scope', '$rootScope', '$location', '$interval', '$modal', '$log', 'AuthService',
        function($scope, $rootScope, $location, $interval, $modal, $log, AuthService) {
            
            $scope.showTab = "info"; // info, msg, prior, notes
            $scope.showMessage = false;
            $scope.showMessageAux = false;
            $rootScope.hideDischarged = true;
            $rootScope.hideDeleted = true;

            // $scope.updateDate = "11/15/15";

            $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
                $scope.isLoggedIn = isLoggedIn;
                $scope.currentUser = AuthService.currentUser();
            });

            /////////////////////////////////////////////////////////////////////////////////////////////
            // User Options
            /////////////////////////////////////////////////////////////////////////////////////////////

            $scope.logout = function () {
                AuthService.logout(function () {
                    $location.path("/login");            
                });
            }

            $scope.showChangePasswdDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/app/modules/users/change-passwd.dialog.html',
                    controller: 'showChangePasswdCtrl',
                    resolve: {
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('reports generated!');
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////
            // Admin Options
            ///////////////////////////////////////////////////////////////////////////////////////////////

            $scope.showReportsDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/app/modules/reports/show-reports.dialog.html',
                    controller: 'showReportsCtrl',
                    resolve: {
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('reports generated!');
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });
            }

            $scope.usersReportsDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/app/modules/users/users-report.dialog.html',
                    controller: 'usersReportCtrl',
                    resolve: {
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('reports generated!');
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////
            // E-Mail Management
            ///////////////////////////////////////////////////////////////////////////////////////////////

            $rootScope.openHelpModal = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/app/components/mailer/send-mail.dialog.html',
                    controller: 'sendEmailCtrl',
                    resolve: {
                        messageType: function () {
                            return "help";
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('Help message sent!');
                }, function () {
                    $log.info('Help Modal dismissed at: ' + new Date());
                });  
            }

            /////////////////////////////////////////////////////////////////////////////////////////////
            // Patient Options
            /////////////////////////////////////////////////////////////////////////////////////////////

            $scope.newPatient = function () {
                
                var modalInstance = $modal.open({
                    templateUrl: '/app/modules/patients/register-patient.dialog.html',
                    controller: 'registerPatientCtrl',
                    resolve: {
                        patient: function () {
                            return null;
                        },
                        physicians: function () {
                            return $rootScope.selectedPhysicians;
                        },
                        modalFunction: function () {
                            return "new";
                        }
                    }
                });

                modalInstance.result.then(function (patient) {
                    $scope.patientList.push(patient);
                    $scope.filteringActive($scope.colFilter);
                    $scope.filteringActive($scope.colFilter);
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });
            }

            $scope.showNotesDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/app/modules/patients/show-notes.dialog.html',
                    controller: 'showNotesCtrl',
                    resolve: {
                        patients: function () {
                            return _.filter($rootScope.patientList, function (pat) {
                                return pat.notes && pat.notes != "";
                            });
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('notes shown!');
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////
            // Bulk Messages
            ////////////////////////////////////////////////////////////////////////////////////
            
            $scope.sendBulkMessages = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/partials/sendMessageBulk.html',
                    controller: 'bulkMessageCtrl',
                    resolve: {
                        patients: function () {
                            return $scope.patientList;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $log.info('Imaging message sent!');
                }, function () {
                    $log.info('Message Modal dismissed at: ' + new Date());
                });  
            }
        }]
    }
});