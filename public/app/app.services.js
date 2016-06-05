//============================ Alert managment ==========================================

orthopaedicsServices.factory('Alerts', ['$rootScope', function ($rootScope) {
        var systemAlerts = [];

        return {
            addAlert: function (type, message) { 
                var newAlert = {type: type, msg: message};
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
            },
            closeAlert: function (index) {
                systemAlerts.splice(index, 1);
            },
            getAlerts: function () {
                return systemAlerts;
            }
        };
}]);

//////////////////////////////////////////
////  API General
//////////////////////////////////////////

orthopaedicsServices.factory('Messages', ['$resource',
    function($resource){
        return $resource('/api/messages/:messageId', {messageId: "@_id"}, {
            sendMessage: {method: "POST"},
            sendWelcomeMessage: {method: "POST", url: '/api/messages/welcome'},
            sendBulkMessages: {method: "POST", url: '/api/messages/bulk'}
        });
}]);

orthopaedicsServices.factory('Emails', ['$resource',
    function($resource){
        return $resource('/api/emails/:emailId', {emailId: "@_id"}, {
            sendHelpMail: {method: "POST", url: '/api/emails/help'}
        });
}]);

