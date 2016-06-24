angular.module("adminModule")
.factory('Config', ['$resource',
    function($resource){
        return $resource('/api/config', {}, {
        	update: {method: "PUT"}
    });
}]);