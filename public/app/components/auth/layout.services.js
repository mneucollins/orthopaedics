angular.module("appCommons")
.factory('LayoutService',['AuthService',function(AuthService){

	var currentUser = AuthService.currentUser();

	return {

		coloredPriorTime : function(){
			if(currentUser.isCustomLayout){
				return currentUser.role.layout.coloredPriorTime;
			} else {
				return currentUser.layout.coloredPriorTime;
			}
		},

		highlightNewPatients : function(){
			if(currentUser.isCustomLayout){
				return currentUser.role.layout.highlightNewPatients;
			} else {
				return currentUser.layout.highlightNewPatients;
			}
		}

	};

}]);