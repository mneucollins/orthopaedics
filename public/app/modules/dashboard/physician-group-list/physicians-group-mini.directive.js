angular.module('dashboardModule')
.directive('physiciansGroupMini',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			group : '='
		},
		templateUrl : '/app/modules/dashboard/physician-group-list/physicians-group-mini.html'
	};
});