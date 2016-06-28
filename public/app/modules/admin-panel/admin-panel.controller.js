
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

        options = {
          keys: ['name']   // keys to search
        }

        Physician.query(function(data, err) {
          fusePhysicians = new Fuse(data, options);
        });
    }

    var options2 = {
      keys: ['name','username'],   // keys to search in
      threshold: 0.2
      //id: 'name'                     // return a list of identifiers only
    }

    var fuseUsers;// = new Fuse($scope.usersArray, options);
    

    User.query(function(data, err) {
      $scope.result = data;
      fuseUsers = new Fuse(data, options2);
    });

    Role.query(function(data, err) {
        $scope.roles = data;
    });
    
    $scope.search = function (findElement, type) {
        if(type == "1")
            $scope.result = fuseUsers.search(findElement);
        else if(type == "3")
            $scope.result = fusePhysicians.search(findElement);
    }

    $scope.loadRegister = function (register) {
        $scope.selectedItem = register;
    }

    $scope.newUser = function(){
        $scope.selectedItem = {};
        newUser = true;
    }

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

    $scope.cancelChanges = function(){
        $scope.selectedItem = null;
        newUser = false;
    }

    function retrievePatients () {
        $scope.patientList = [];
        var physicians = $scope.selectedPhysicians;

        for (var i = 0; i < physicians.length; i++) {
            var physician = physicians[i];

            Physician.getPatientsToday({physicianId: physician._id}, function (patients) {
                var pList = _.sortBy(patients, function(patient){ return new Date(patient.apptTime).getTime(); });  // sort by appt time (hours)
                _.each(pList, function (element, index, list) {
                    list[index].messageSelectorPos = 1;
                });
                $scope.patientList = $scope.patientList.concat(pList);
                pList = _.sortBy($scope.patientList, function(patient){ return new Date(patient.apptTime).getTime(); }); 
                $scope.patientList = pList;
                $rootScope.patientList = pList;

                //alert('col:' + $scope.colFilter);
                $scope.filteringActive($scope.colFilter, 0);
            });
        };
    }
    

}]);