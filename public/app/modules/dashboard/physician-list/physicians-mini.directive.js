angular.module('dashboardModule')
.directive('physiciansMini',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			physician : '='
		},
		templateUrl : '/app/modules/dashboard/physician-list/physicians-mini.html'

	};
});