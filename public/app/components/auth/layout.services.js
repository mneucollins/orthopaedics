angular.module("appCommons")
.factory('LayoutService',[/*'AuthService',*/function(/*AuthService*/){

	var layout;
	// if(AuthService.currentUser())
	// 	if(AuthService.currentUser().isCustomLayout){
	// 		layout = AuthService.currentUser().role.layout;
	// 	} else {
	// 		layout = AuthService.currentUser().layout;
	// 	}

	return {
		setLayoutUser: function (user) {
			if(user){
				if(user.isCustomLayout){
					layout = user.role.layout;
				} else {
					layout = user.layout;
				}
			}
		},
		coloredPriorTime : function(){
			if(!layout){
				return false;
			}
			return layout.coloredPriorTime;
		},

		highlightNewPatients : function(){
			if(!layout){
				return false;
			}
			return layout.highlightNewPatients;
		}

	};

}]);