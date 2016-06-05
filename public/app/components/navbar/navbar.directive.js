
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

            $scope.updateDate = "11/15/15";

            $scope.$watch(AuthService.isLoggedIn, function ( isLoggedIn ) {
                $scope.isLoggedIn = isLoggedIn;
                $scope.currentUser = AuthService.currentUser();
            });

            $scope.logout = function () {
                AuthService.logout(function () {
                    $location.path("/login");            
                });
            }

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

            $interval(function () {
                var url = $location.path();

                if(url.indexOf("dashboard1") != -1){
                    $rootScope.dashboard = "1";
                    if($scope.currentUser.role == "Physician" || $scope.currentUser.role == "FirstProvider")
                        $location.url("/dashboard2");
                } 
                else if(url.indexOf("dashboard2") != -1) {
                    $rootScope.dashboard = "2";
                    if($scope.currentUser.role == "Imaging" || $scope.currentUser.role == "Receptionist") 
                        $location.url("/dashboard1");
                }
            }, 1000);

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
        }]
    }
});