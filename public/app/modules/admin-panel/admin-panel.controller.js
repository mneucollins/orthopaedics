
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User',
  function($scope, $location, $rootScope, $log, User) {

    //$scope.findUser = "b";

// var options = {
//   keys: ['author', 'title'],   // keys to search in
//   id: 'id'                     // return a list of identifiers only
// }

var options = {
  keys: ['name'],   // keys to search in
  id: 'name'                     // return a list of identifiers only
}

    //var fuse = new Fuse(books, options);
    var fuse;// = new Fuse($scope.usersArray, options);

    User.query(function(data, err) {
      fuse = new Fuse(data, options);
    });

    $scope.search = function (findUser) {
        $scope.result = fuse.search(findUser);
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