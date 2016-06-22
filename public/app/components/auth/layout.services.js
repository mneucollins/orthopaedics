angular.module("appCommons")
.factory('LayoutService',['AuthService',function(AuthService){

	var layout;
	if(AuthService.currentUser())
		if(AuthService.currentUser().isCustomLayout){
			layout = AuthService.currentUser().role.layout;
		} else {
			layout = AuthService.currentUser().layout;
		}

	return {
		setLayoutUser: function (user) {
			if(AuthService.currentUser().isCustomLayout){
				layout = user.role.layout;
			} else {
				layout = user.layout;
			}
		}
		coloredPriorTime : function(){
			// if(currentUser.isCustomLayout){
			// 	return currentUser.role.layout.coloredPriorTime;
			// } else {
			// 	return currentUser.layout.coloredPriorTime;
			// }
			return layout.coloredPriorTime;
		},

		highlightNewPatients : function(){
			// if(currentUser.isCustomLayout){
			// 	return currentUser.role.layout.highlightNewPatients;
			// } else {
			// 	return currentUser.layout.highlightNewPatients;
			// }
			return layout.highlightNewPatients;
		}

	};

}]);