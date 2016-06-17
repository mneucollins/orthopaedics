angular.module("messagesModule")
.factory('Messages', ['$resource',
    function($resource){
        return $resource('/api/messages/:messageId', {messageId: "@_id"}, {
            sendMessage: {method: "POST"},
            sendWelcomeMessage: {method: "POST", url: '/api/messages/welcome'},
            sendBulkMessages: {method: "POST", url: '/api/messages/bulk'}
        });
}]);