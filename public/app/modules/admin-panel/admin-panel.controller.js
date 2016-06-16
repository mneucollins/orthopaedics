
angular.module('adminModule')
.controller('adminCtrl', ['$scope', '$location', '$rootScope', '$log', 'User',
  function($scope, $location, $rootScope, $log, User) {

    $scope.findUser = "hola";

    var users = User.query(function() {});
    // User.setSecurityQuestions({userId: theUser._id}, {
    //     email: $scope.user.email, 
    //     securityQuestion: $scope.user.question, 
    //     securityAnswer: $scope.user.answer
    // }, function(user) {
    //     if(!user) {
    //         Alerts.addAlert("warning", "There was an error saving the user");
    //         return;
    //     }
        
    //     goToDashboard(user);

    // }, function (err) {
    //     Alerts.addAlert("danger", "ups! we got an error: " + JSON.stringify(err));
    // });


    var books = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
},{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];

var options = {
  keys: ['author', 'title'],   // keys to search in
  id: 'id'                     // return a list of identifiers only
}

    var fuse = new Fuse(books, options);

    $scope.search = function (findUser) {
        var result = fuse.search(findUser);
        alert(result);
        //$result.empty();
      // $.each(r, function() {
      //   $result.append('<li class="result-item">' + this.title + ', <span>' + this.author + '</span></li>');
      // });
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