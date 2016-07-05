angular.module("appCommons")
.factory('LayoutService',[/*'AuthService',*/function(/*AuthService*/){

	var layout;

	var columns = [
        "action-column",
        "age-column",
        "appt-time-column",
        "appt-type-column",
        "at-column",
        "fp-column",
        "fc-column",
        "imaging-column",
        "labs-column",
        "name-column",
        "physician-column",
        "room-number-column",
        "wait-status-column",
        "wait-total-column"
    ];



	// if(AuthService.currentUser())
	// 	if(AuthService.currentUser().isCustomLayout){
	// 		layout = AuthService.currentUser().role.layout;
	// 	} else {
	// 		layout = AuthService.currentUser().layout;
	// 	}

	return {
		setLayoutUser : function (user) {
			if(user){
				if(user.isCustomLayout){
					layout = user.role.layout;
				} else {
					layout = user.layout;
				}
			}
		},
		getLayoutUser : function (){
			if(layout){
				return layout;
			} else {
				return null;
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
		},

		getOtherColumns : function(){
			if(layout){
				var actualColumns = layout.columns;
				var otherColumns = [];
				for(var i in columns){
					if(actualColumns.indexOf(columns[i]) == -1){
						otherColumns.push(columns[i]);
					}
				}
				return otherColumns;
			} else {
				return null;
			}
		}

	};

}]);