angular.module("usersModule")
.factory('User', ['$resource',
    function($resource){
        return $resource('/api/users/:userId', {userId: "@_id"}, {
            update: {method: "PUT"},
            setSecurityQuestions: {method: "PUT", url: "/api/users/:userId/questions"},
            restorePassword: {method: "PUT", url: "/api/users/:userId/restorePassword"},
            getByToken: {method: "GET", url: "/api/users/token/:token"},
            retrievePassword:{method: "POST", url: "/api/users/passwordRetrieval"},
            changePassword:{method: "PUT", url: "/api/users/:userId/changePassword"}
    });
}]);