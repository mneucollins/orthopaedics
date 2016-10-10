
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

    $scope.loadUsers = function(){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = false;
        inPhyGroup = false;
    }
    
    $scope.loadPhysicians = function(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        inRoles = false;
        inPhyGroup = false;
    }
    
    $scope.loadPhysicianGroups = function(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        inRoles = false;
        inPhyGroup = true;
    }

    $scope.loadRoles = function (){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = true;
        inPhyGroup = false;
    }

    $scope.fuseUsers;// = new Fuse($scope.usersArray, options);
    
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
    
    $scope.cancelChanges = function(){
        $scope.selectedItem = null;
        $scope.newUser = false;
    }

}]);