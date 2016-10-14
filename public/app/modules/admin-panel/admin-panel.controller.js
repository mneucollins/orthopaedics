
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', '$timeout', 'User', 'Physician', 'PhysicianFrontDeskGroup', 'Alerts','Role', 'AuthService', 'LayoutService',
  function($scope, $location, $rootScope, $log, $timeout, User, Physician, PhysicianFrontDeskGroup, Alerts, Role, AuthService, LayoutService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

    var fusePhysicians;
    var options;
    var inRoles = false;
    var inPhyGroup = false;
    var selectedRow;
    $scope.newUser = false;
    $scope.selectedItem = null;
    $scope.items1 = [];
    $scope.items2 = [];

    $scope.tabs = [
        {title:'Users', selecOpt:'loadUsers()', active:true},
        {title:'Roles', selecOpt:'loadRoles()', active:false},
        {title:'Physicians', selecOpt:'loadPhysicians()', active:false},
        {title:'Physician Groups', selecOpt:'loadPhysicianGroups()', active:false},
        {title:'Messages', selecOpt:'', active:false},
        {title:'General', selecOpt:'', active:false},
    ];

    $scope.selectOption = function(tab){

    }

    $scope.loadUsers = function(actualTab){
        var newTab = "";
        for(var i in $scope.tabs){
            if($scope.tabs[i].active && $scope.tabs[i].title!=actualTab){
                newTab = $scope.tabs[i].title;
            }
        }

        // var salir = confirm("unsaved changes will not persist, do you want to continue?");
        
        // if (!salir){
        //     $timeout(function(){
        //         _.each($scope.tabs, function(elem,index,list){
        //             if(elem.title == actualTab) list[index].active = true;
        //             else list[index].active = false;
        //         });

        //     }, 250);
        // }

        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        $scope.auxItem = null;
        inRoles = newTab == "Roles";
        inPhyGroup = newTab == "Physician Groups";
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
        $scope.selectedItem = null;
        inRoles = true;
        inPhyGroup = false;
    }

    $scope.fuseUsers;// = new Fuse($scope.usersArray, options);
    
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

        $scope.auxItem = angular.copy($scope.selectedItem);

    });
    
    $scope.cancelChanges = function(){
        $scope.selectedItem = selectedRow;
        $scope.newUser = false;
    }

    $scope.onEdit = false;
    $scope.editing = function(){
        $scope.onEdit = true;
    }

    $scope.$on('$routeChangeStart', function(next, current) { 
        if($scope.onEdit)
            Alerts.addAlert("warning", "You are leaving this screen with pending changes, are you sure?");
    });

}]);