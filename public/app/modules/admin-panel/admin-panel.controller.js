
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', '$timeout', 'User', 'Physician', 'PhysicianFrontDeskGroup', 'Alerts','Role', 'AuthService', 'LayoutService',
  function($scope, $location, $rootScope, $log, $timeout, User, Physician, PhysicianFrontDeskGroup, Alerts, Role, AuthService, LayoutService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

    var fusePhysicians;
    var options;
    var inRoles = false;
    var inPhyGroup = false;
    $scope.newUser = false;
    $scope.selectedItem = null;
    $scope.items1 = [];
    $scope.items2 = [];
    $scope.fuseUsers = [];// = new Fuse($scope.usersArray, options);

    $scope.loadUsers = loadUsers;
    $scope.loadPhysicians = loadPhysicians;
    $scope.loadPhysicianGroups = loadPhysicianGroups;
    $scope.loadRoles = loadRoles; 
    $scope.cancelChanges = cancelChanges;
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
          $scope.result = data;
        });

        Physician.query(function(data) {
            $scope.resultPhys = data;
        });

        PhysicianFrontDeskGroup.query(function(data) {
            $scope.resultPhyGroups = data;
        });

        Role.query(function(data) {
            $scope.roles = data;
        });
    }

    //////////////////////////////

    function loadUsers(){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = false;
        inPhyGroup = false;

        if($scope.result.length == 0) {
            User.query(function(data) {
              $scope.result = data;
            });
        }
    }

    function loadPhysicians(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        inRoles = false;
        inPhyGroup = false;

        if($scope.resultPhys.length == 0) {
            Physician.query(function(data) {
                $scope.resultPhys = data;
            });
        }
    }
    
    function loadPhysicianGroups(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        inRoles = false;
        inPhyGroup = true;

        if($scope.resultPhyGroups.length == 0) {
            PhysicianFrontDeskGroup.query(function(data) {
                $scope.resultPhyGroups = data;
            });
        }
    }

    function loadRoles(){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = true;
        inPhyGroup = false;

        if($scope.roles.length == 0) {
            Role.query(function(data) {
                $scope.roles = data;
            });
        }
    }
    
    function cancelChanges(){
        $scope.selectedItem = null;
        $scope.newUser = false;
    }

    //////////////////////////////

    $scope.$on('listado', function(event, args){
        $scope.selectedItem = args.listado;
        if(inRoles) {
            if ($scope.selectedItem.layout){
                $scope.layout = $scope.selectedItem.layout;
            } else {
                $scope.layout = {
                    "coloredPriorTime" : false,
                    "highlightNewPatients" : false,
                    "columns" : [ 
                        "action-column", 
                        "appt-time-column", 
                        "name-column", 
                        "wait-status-column", 
                        "wait-total-column"
                    ]
                }
            }
            $scope.items2 = LayoutService.getActiveColumns($scope.layout);
            $scope.items1 = LayoutService.getInactiveColumns($scope.layout);
        }
        
        if(jQuery.isEmptyObject(args.listado))
            $scope.newUser = true;
        else
            $scope.newUser = false;

        // se carga lista de physician en el caso de que sea un grupo
        if($scope.selectedItem.physicians)
            $scope.$broadcast('setSelectedPhysicians', $scope.selectedItem.physicians);
        //     $timeout(function () {
        //     }, 300);
        if(!$scope.selectedItem.physicians && inPhyGroup)
            $scope.$broadcast('setSelectedPhysicians', []);

    });

}]);