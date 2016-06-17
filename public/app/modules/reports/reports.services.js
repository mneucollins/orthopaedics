angular.module("reportsModule")
.factory('Reports', ['$resource',
    function($resource){
        return $resource('/api/reports/:reportId', {messageId: "@_id"}, {
            generate: {method: "GET", url: '/api/reports/generate'}
        });
}]);