
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User', 'Physician','Alerts','Role',
  function($scope, $location, $rootScope, $log, User, Physician, Alerts, Role) {

    // var options = {
    //   keys: ['author', 'title'],   // keys to search in
    //   id: 'id'                     // return a list of identifiers only
    // }

    var fusePhysicians;
    var options;
    var newUser = false;
    $scope.selectedItem = null;

    $scope.loadUsers = function(){
        $scope.result = "";
        $scope.findUser = "";
    }
    
    $scope.loadPhysicians = function(){
        $scope.result = "";
        $scope.findUser = "";
        $scope.selectedItem = null;
        
        // options = {
        //   keys: ['name']   // keys to search
        // }

        // Physician.query(function(data, err) {
        //   $scope.resultPhys = data;
        //   //fusePhysicians = new Fuse(data, options);
        // });
    }

    // var options2 = {
    //   keys: ['name','username'],   // keys to search in
    //   threshold: 0.2
    //   //id: 'name'                     // return a list of identifiers only
    // }

    $scope.fuseUsers;// = new Fuse($scope.usersArray, options);
    

    User.query(function(data, err) {
      $scope.result = data;
      //$scope.fuseUsers = new Fuse(data, options2);
    });

    Physician.query(function(data, err) {
        $scope.resultPhys = data;
        //fusePhysicians = new Fuse(data, options);
    });

    Role.query(function(data, err) {
        $scope.roles = data;
    });
    
    // $scope.search = function (findElement, type) {
    //     if(type == "1")
    //         $scope.result = $scope.fuseUsers.search(findElement);
    //     else if(type == "3")
    //         $scope.result = fusePhysicians.search(findElement);
    // }

    // $scope.loadRegister = function (register) {
    //     $scope.selectedItem = register;
    // }
    $scope.$on('listado', function(event, args){
        $scope.selectedItem = args.listado;
        if(jQuery.isEmptyObject(args.listado) )
            newUser = true;
        else
            newUser = false;
    })

    // $scope.newUser = function(){
    //     // $scope.selectedItem = {};
    //     newUser = true;
    // }

    $scope.saveUserChanges = function () {
        if(newUser == true)
        {
            User.save($scope.selectedItem, 
               function (argument) {
               Alerts.addAlert("success", "User created!");
               $scope.selectedItem = null;
               newUser = false;
            }, function (err) {
                Alerts.addAlert("warning", "Error");
            });
        }
        else
        {
            $scope.selectedItem.role = $scope.selectedItem.role._id;
            User.update({userId: $scope.selectedItem._id}, 
                $scope.selectedItem, 
                function (argument) {
               Alerts.addAlert("success", "User updated!");
               $scope.selectedItem = null;
            }, function (err) {
                Alerts.addAlert("warning", "Error");
            });
        }
    }

    $scope.savePhysChanges = function () {
        if(newUser == true)
        {
            Physician.save($scope.selectedItem, 
               function (argument) {
               Alerts.addAlert("success", "Physician created!");
               $scope.selectedItem = null;
               newUser = false;
            }, function (err) {
                Alerts.addAlert("warning", "Error");
            });
        }
        else
        {
            Physician.update({userId: $scope.selectedItem._id}, 
                $scope.selectedItem, 
                function (argument) {
               Alerts.addAlert("success", "Physician updated!");
               $scope.selectedItem = null;
            }, function (err) {
                Alerts.addAlert("warning", "Error");
            });
        }
    }

    $scope.cancelChanges = function(){
        $scope.selectedItem = null;
        newUser = false;
    }


}]);