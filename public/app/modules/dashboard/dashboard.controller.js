
angular.module('dashboardModule')
.controller('dashboardCtrl', ['$scope', '$location', '$rootScope', '$log', '$interval', '$timeout', '$modal', 'Patient', 'Messages', 'Physician', 'AuthService', 'LayoutService', 'DashboardService', 'PatientStoreService',
  function($scope, $location, $rootScope, $log, $interval, $timeout, $modal, Patient, Messages, Physician, AuthService, LayoutService, DashboardService, PatientStoreService) {

    if(!AuthService.isLoggedIn())
        $location.path("/");

    var socket;

    $scope.arrowDirection = 0;
    $scope.colFilter  = "appt-time-column";
    $scope.hidePhysicians = false;
    $scope.hidePhysiciansList = false;
    $scope.isFrontdeskAdmin = AuthService.isFrontdeskAdmin;
    $scope.highlightNewPatients = LayoutService.highlightNewPatients();
    $scope.titles = LayoutService.getActiveColumns();
    $scope.layout = LayoutService.getLayoutUser();

    $rootScope.tooglePhysiciansList = tooglePhysiciansList;
    $scope.fillSchedules = fillSchedules;
    $scope.reloadPatients = reloadPatients;
    $scope.filteringActive = filteringActive;
    $scope.getPatientList = PatientStoreService.getPatientList;
        
    activate();

    ////////////////////////////////////

    function activate() {

        $("nav").removeClass("hidden");
        $("body").removeClass("body-login");
        $scope.currentTime = new Date();
        $timeout(resizePhybar, 300); // método en el main.js

        initSocket();

        $interval(function minuteUpdate () {
            $scope.currentTime = new Date();
        }, 1000);

        $interval(function checksocketConnection () {  
            if(!socket.connected) {
                $log.log("socket is disconnected! reconecting...");
                initSocket();
            }
        }, 60000);

        filteringActive($scope.colFilter); 
    }

    $scope.$on("onPhysiciansSelected", function (physicians) {
        reloadPatients();
        $scope.hidePhysicians = physicians.length == 1;
    });

    function tooglePhysiciansList() {
        $scope.hidePhysiciansList = !$scope.hidePhysiciansList;
    }

    function fillSchedules() {
        $scope.$broadcast("fillSchedules");
        // $timeout(function () {
        //     reloadPatients();
        //     $scope.hidePhysicians = physicians.length == 1;
        // }, 100);

        $scope.hidePhysiciansList = true;
    }

    function reloadPatients() {
        PatientStoreService.retrievePatients();
        $scope.$apply();
    }

    function calcEspacioExtra(scope, element, attrs){
    
        var totalLenght = 0;
        var newLenght = 0;

        for(var i in $scope.titles){
            totalLenght+=$scope.titles[i].len;
        }

        if(totalLenght<97){
            //var newLenght = 0;
            var newLenght = 97-totalLenght+13;
            var columnData = LayoutService.getColumnData();
            columnData["name-column"]["len"]=newLenght;
            LayoutService.setColumnData(columnData);
        }

        //$log.info(JSON.stringify($scope.titles));

        // var total = 0;
        // for(var i in $scope.titles){
        //     total+=columnData[$scope.titles[i]];
        // }

        // for(var directive in $scope.layout.columns){
        //     $scope.titles.push(LayoutService.getTitleName($scope.layout.columns[directive]));
        // }
    }

    function filteringActive(idLauncher){
        
        var changeDirection = false;
        if($scope.colFilter == idLauncher)
            changeDirection = true;

        if(changeDirection) {
            if($scope.arrowDirection == 0)
                $scope.arrowDirection = 1;
            else
                $scope.arrowDirection = 0;
        }
        else
            $scope.arrowDirection = 0;

        $scope.colFilter = idLauncher;
        PatientStoreService.orderList(idLauncher, $scope.arrowDirection == 1);

        // if($scope.arrowDirection == 1){
        //     PatientStoreService.orderList(idLauncher, false);
        //     $scope.arrowDirection = 0;
        // }
        // else if($scope.arrowDirection == 0){
        //     PatientStoreService.orderList(idLauncher, true);
        //     $scope.arrowDirection = 1;
        // }
        // else {
        //     PatientStoreService.orderList(idLauncher, false);
        //     $scope.arrowDirection = 0;
        // }
    }

    // Messages Management
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // $scope.sendImagingMessage = function (patient) {

    //     if(!patient.noPhone) {
    //         var modalInstance = $modal.open({
    //             templateUrl: '/app/modules/messages/send-message.dialog.html',
    //             controller: 'sendMessageCtrl',
    //             resolve: {
    //                 patient: function () {
    //                     return patient;
    //                 },
    //                 messageType: function () {
    //                     return "IM";
    //                 }
    //             }
    //         });

    //         modalInstance.result.then(function () {
    //             $log.info('Imaging message sent!');
    //         }, function () {
    //             $log.info('Message Modal dismissed at: ' + new Date());
    //         });  
    //     }
    // }

    // Sync
    ///////////////////////////////////////////////////////////////////////////////////////////////

    function initSocket () {
        socket = io.connect($location.protocol() + '://' + $location.host() + ":" + $location.port());
        
        socket.on('syncPatient', function (updPatient) {
            PatientStoreService.updatePatient(updPatient);
            // $scope.filteringActive($scope.colFilter);
            $log.log("Actualizando patient: " + updPatient.fullName);
            $scope.$apply();
        });
        
        socket.on('greetings', function (greet) {
            $log.log(JSON.stringify(greet));
        });

        $log.log("socket is ready!");
    }
    
}]);