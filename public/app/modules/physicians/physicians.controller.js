
angular.module('physiciansModule')
.controller('physiciansCtrl', ['$scope', '$location', '$rootScope', '$window', 'AuthService', 'Physician',
  function($scope, $location, $rootScope, $window, AuthService, Physician) {

    setTimeout(resizePhybar, 100); // método en el main.js
    $rootScope.selectedPhysicians = [];
    $rootScope.hidePhysiciansList = false;

    Physician.query(function (physicians) {
        _.each(physicians, function (element, index, list) {
            list[index].selected = false;
        });
        $scope.physicianList = physicians;
    });

    $scope.selectPhysician = function (physician) {
         
        var role = AuthService.currentUser().role;
        physician.selected = !physician.selected;
        
        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
            return physician.selected;
        });
        $scope.phySelectAll = selectedPhysicians.length == $scope.physicianList.length;
    }

    $scope.fillSchedules = function () {
        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
            return physician.selected;
        }); 

        $rootScope.selectedPhysicians = selectedPhysicians;
        $rootScope.hidePhysiciansList = true;
        // $(".physiciansList").css("left", "-37%");
    }

    $rootScope.tooglePhysiciansList = function () {
        $rootScope.hidePhysiciansList = !$rootScope.hidePhysiciansList;
        // var currentPos = $(".physiciansList").css("left");

        // if(currentPos.charAt(0) == "-") // it's hidden
        //     $(".physiciansList").css("left", "5em");
        // else
        //     $(".physiciansList").css("left", "-37%");
    }

    $scope.selectAll = function () {
        if ($scope.phySelectAll) $scope.phySelectAll = true;
        else $scope.phySelectAll = false;

        angular.forEach($scope.physicianList, function (physician) {
            physician.selected = $scope.phySelectAll;
        });
    }

}]);