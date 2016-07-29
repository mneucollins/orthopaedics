
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User', 'Physician','Alerts','Role', 'AuthService', 'LayoutService',
  function($scope, $location, $rootScope, $log, User, Physician, Alerts, Role, AuthService, LayoutService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

    var fusePhysicians;
    var options;
    var inRoles = false;
    $scope.newUser = false;
    $scope.selectedItem = null;
    $scope.items1 = [];
    $scope.items2 = [];

    $scope.loadUsers = function(){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = false;
    }
    
    $scope.loadPhysicians = function(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        inRoles = false;
    }

    $scope.loadRoles = function (){
        $scope.result = "";
        $scope.findUser = "";
        inRoles = true;
    }

    $scope.fuseUsers;// = new Fuse($scope.usersArray, options);
    
    User.query(function(data, err) {
      $scope.result = data;
    });

    Physician.query(function(data, err) {
        $scope.resultPhys = data;
    });

    Role.query(function(data, err) {
        $scope.roles = data;
    });

    $scope.$on('listado', function(event, args){
        $scope.selectedItem = args.listado;
        if(inRoles) {
            $scope.layout = $scope.selectedItem.layout;
            $scope.items2 = LayoutService.getActiveColumns($scope.selectedItem.layout);
            $scope.items1 = LayoutService.getInactiveColumns($scope.selectedItem.layout);
        }
        
        if(jQuery.isEmptyObject(args.listado))
            $scope.newUser = true;
        else
            $scope.newUser = false;
    });
    
    $scope.cancelChanges = function(){
        $scope.selectedItem = null;
        $scope.newUser = false;
    }

}]);