
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User', 'Physician','Alerts','Role',
  function($scope, $location, $rootScope, $log, User, Physician, Alerts, Role) {

    var fusePhysicians;
    var options;
    $scope.newUser = false;
    $scope.selectedItem = null;

    $scope.loadUsers = function(){
        $scope.result = "";
        $scope.findUser = "";
    }
    
    $scope.loadPhysicians = function(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
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
        if(jQuery.isEmptyObject(args.listado) )
            $scope.newUser = true;
        else
            $scope.newUser = false;
    })
    
    $scope.cancelChanges = function(){
        $scope.selectedItem = null;
        $scope.newUser = false;
    }


}]);