angular.module("rolesModule")
.factory('Role', ['$resource',
    function($resource){
        return $resource('/api/roles/:roleId', {roleId: "@_id"}, {
            update: {method: "PUT"}
    });
}]);