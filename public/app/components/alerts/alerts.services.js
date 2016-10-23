angular.module("appCommons")
.factory('Alerts', ['$rootScope', function ($rootScope) {
        var systemAlerts = [];

        return {
            addAlert: addAlert,
            info: function (message) {
                addAlert("success", message);
            },
            warn: function (message) {
                addAlert("warning", message);
            },
            danger: function (message) {
                addAlert("danger", message);
            },
            closeAlert: function (index) {
                systemAlerts.splice(index, 1);
            },
            getAlerts: function () {
                return systemAlerts;
            },
            closeAlert: function (index) {
                systemAlerts.splice(index, 1);
            },
            getAlerts: function () {
                return systemAlerts;
            }
        };


        function addAlert(type, message) { 
            var newAlert = {
                type: type, // might be: success, warning, danger
                msg: message
            };
            systemAlerts.push(newAlert);

            function autoCloseAlert (value) {
                setTimeout(function () {
                    var index = systemAlerts.indexOf(value);
                    if(index != -1) {
                        systemAlerts.splice(index, 1);
                        $rootScope.$broadcast('alerts:updated',systemAlerts);
                    }
                }, 3000);
            }

            autoCloseAlert(newAlert);
        }
}]);