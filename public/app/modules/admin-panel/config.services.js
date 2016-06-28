angular.module("adminModule")
.factory('Config', ['$resource', '$interval',
    function($resource, $interval){

    	var sysConfig = {};
    	var configResource = $resource('/api/config', {}, {
	        update: {method: "PUT"}
	    });

    	function loadConfig() {
		    configResource.get(function (data) {
		    	sysConfig = data;
		    });
    	}

    	loadConfig();
    	$interval(loadConfig, 3 * 60 * 60 * 1000);

        return {
        	get: configResource.get,
        	update: configResource.update,
        	reload: loadConfig,
        	getFrontdeskBanner: function () {
        		return sysConfig.frontdeskBanner;
        	},
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