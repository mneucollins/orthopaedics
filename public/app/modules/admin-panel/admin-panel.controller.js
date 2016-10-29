
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', '$timeout', 'User', 'Physician', 'PhysicianFrontDeskGroup', 'Alerts','Role', 'AuthService',
  function($scope, $location, $rootScope, $log, $timeout, User, Physician, PhysicianFrontDeskGroup, Alerts, Role, AuthService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

    $scope.isNew = false;
    $scope.isEditing = false;
    $scope.selectedItem = null;
    // $scope.items1 = [];
    // $scope.items2 = [];
    // $scope.fuseUsers = [];

    $scope.loadUsers = loadUsers;
    $scope.loadPhysicians = loadPhysicians;
    $scope.loadPhysicianGroups = loadPhysicianGroups;
    $scope.loadRoles = loadRoles; 

    $scope.isAdminUsers = AuthService.isAdminUsers;
    $scope.isAdminPhysicians = AuthService.isAdminPhysicians;
    $scope.isAdminRoles = AuthService.isAdminRoles;
    $scope.isAdminLanguage = AuthService.isAdminLanguage;
    $scope.isAdminGeneral = AuthService.isAdminGeneral;
    $scope.canGenerateReports = AuthService.canGenerateReports;
    $scope.isFrontdeskAdmin = AuthService.isFrontdeskAdmin;

    activate();

    function activate() {

        User.query(function(data) {
          $scope.result = _.sortBy(data, 'name');
        });

        Physician.query(function(data) {
            $scope.resultPhys = _.sortBy(data, 'lastName');
        });

        PhysicianFrontDeskGroup.query(function(data) {
            $scope.resultPhyGroups = _.sortBy(data, 'name');
        });

        Role.query(function(data) {
            $scope.roles = _.sortBy(data, 'name');
        });
    }

    //////////////////////////////

    function loadUsers() {
        $scope.result = "";
        $scope.findUser = "";

        if($scope.result.length == 0) {
            User.query(function(data) {
              $scope.result = _.sortBy(data, 'name');
            });
        }
    }

    function loadPhysicians() {

        if($scope.resultPhys.length == 0) {
            Physician.query(function(data) {
                $scope.resultPhys = _.sortBy(data, 'lastName');
            });
        }
    }
    
    function loadPhysicianGroups() {

        if($scope.resultPhyGroups.length == 0) {
            PhysicianFrontDeskGroup.query(function(data) {
                $scope.resultPhyGroups = _.sortBy(data, 'name');
            });
        }
    }

    function loadRoles() {

        if($scope.roles.length == 0) {
            Role.query(function(data) {
                $scope.roles = _.sortBy(data, 'name');
            });
        }
    }

    //////////////////////////////

    $scope.$on('$locationChangeStart', function (event, next, current) {
        if ($scope.isEditing) {
            var answer = confirm("Are you sure you want to navigate away from this page?");
            if (!answer) {
                event.preventDefault();
            }
        }    
    });

    $scope.$on('listado', function(event, args) {
        $scope.isEditing = true;
    });
}]);