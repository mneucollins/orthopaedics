
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User', 'Physician',
  function($scope, $location, $rootScope, $log, User, Physician) {

    // var options = {
    //   keys: ['author', 'title'],   // keys to search in
    //   id: 'id'                     // return a list of identifiers only
    // }

    var fusePhysicians;
    var options;

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
      keys: ['name']   // keys to search in
      //id: 'name'                     // return a list of identifiers only
    }

    var fuseUsers;// = new Fuse($scope.usersArray, options);
    

    User.query(function(data, err) {
      fuseUsers = new Fuse(data, options2);
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

    $scope.saveChanges = function (user) {
        alert("codigo para hacer update...");
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