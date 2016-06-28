angular.module("adminModule")
.factory('Config', ['$resource', '$interval',
    function($resource, $interval){

    	var sysConfig = {};
    	var configResource = $resource('/api/config', {}, {
	        update: {method: "PUT"}
	    });

    	function updateConfig() {
		    configResource.get(function (data) {
		    	sysConfig = data;
		    });
    	}

    	updateConfig();
    	$interval(updateConfig, 3 * 60 * 60 * 1000);

        return {
        	get: configResource.get,
        	update: configResource.update,
        	getLongWaitMinutes: function () {
        		return sysConfig.longWaitMinutes;
        	},
        	getWarnWaitMinutes: function () {
        		return sysConfig.warnWaitMinutes;
        	},
        	getDangerWaitMinutes: function () {
        		return sysConfig.dangerWaitMinutes;
        	},
        }
}]);