angular.module("appCommons")
.factory('LayoutService',[function(){

	var layout;
	var isImaging = false;
	var isLabs = false;

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
        "pre-register-column",
        "wait-status-column",
        "wait-total-column"
    ];

    var columnData = {
        "action-column":{name:"action-column",title:"Button",style:"buttonRow",len:11},
        "age-column":{name:"age-column",title:"Age",style:"ageRow",len:5},
        "appt-time-column":{name:"appt-time-column",title:"Appt Time",style:"apptTimeRow",len:10},
        "appt-type-column":{name:"appt-type-column",title:"Type",style:"typeRow",len:6},
        "at-column":{name:"at-column",title:"AT Entry",style:"atRow",len:10},
        "fp-column":{name:"fp-column",title:"FP Entry",style:"fpRow",len:10},
        "fc-column":{name:"fc-column",title:"FC",style:"fcRow",len:5},
        "imaging-column":{name:"imaging-column",title:"Imaging",style:"imagingRowSmall",len:6},
        "labs-column":{name:"labs-column",title:"Labs",style:"labsRowSmall",len:6},
        "name-column":{name:"name-column",title:"Name",style:"nameRow",len:13},
        "physician-column":{name:"physician-column",title:"Physician",style:"physicianRow",len:13},
        "room-number-column":{name:"room-number-column",title:"Room",style:"roomRow",len:5},
        "pre-register-column":{name:"pre-register-column",title:"Pre register",style:"prRow",len:7},
        "wait-status-column":{name:"wait-status-column",title:"Status",style:"statusRow",len:12},
        "wait-total-column":{name:"wait-total-column",title:"Total",style:"totalRow",len:6}

    };

    function getTitleName (directiveName){

    	if(isImaging){
    		columnData["imaging-column"] = {name:"imaging-column",title:"Imaging",style:"imagingRow",len:14};
    	}

    	if(isLabs){
			columnData["labs-column"] = {name:"labs-column",title:"Labs",style:"labsRow",len:14};    		
    	}

        switch (directiveName){
            case "action-column" : return columnData["action-column"];
            case "age-column" : return columnData["age-column"];
            case "appt-time-column" : return columnData["appt-time-column"];
            case "appt-type-column" : return columnData["appt-type-column"];
            case "at-column" : return columnData["at-column"];
            case "fp-column" : return columnData["fp-column"];
            case "fc-column" : return columnData["fc-column"];
            case "imaging-column" : return columnData["imaging-column"];
            case "labs-column" : return columnData["labs-column"];
            case "name-column" : return columnData["name-column"];
            case "physician-column" : return columnData["physician-column"];
            case "room-number-column" : return columnData["room-number-column"];
            case "pre-register-column" : return columnData["pre-register-column"];
            case "wait-status-column" : return columnData["wait-status-column"];
            case "wait-total-column" : return columnData["wait-total-column"];
            default : return;

        }
    }


	return {
		setLayoutUser : function (user) {
			if(user){
				isImaging = user.role.isImaging;
				isLabs = user.role.isLabs;
				if(user.isCustomLayout){
					layout = user.layout;
				} else {
					layout = user.role.layout;
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

		getActiveColumns : function(externalLayout){
			if(externalLayout){
				var totalColumns = externalLayout.columns;
				var activeColumns = [];
				for(var i in totalColumns){
					activeColumns.push(getTitleName(totalColumns[i]));
				}
				return activeColumns;
			} else if(layout){
				var totalColumns = layout.columns;
				var activeColumns = [];
				for(var i in totalColumns){
					activeColumns.push(getTitleName(totalColumns[i]));
				}
				return activeColumns;
			} else {
				return null;
			}
		},

		getInactiveColumns : function(externalLayout){
			if(externalLayout){
				var totalColumns = externalLayout.columns;
				var inactiveColumns = [];
				for(var i in columns){
					if(totalColumns.indexOf(columns[i]) == -1){
						inactiveColumns.push(getTitleName(columns[i]));
					}
				}
				return inactiveColumns;
			} else if(layout){
				var totalColumns = layout.columns;
				var inactiveColumns = [];
				for(var i in columns){
					if(totalColumns.indexOf(columns[i]) == -1){
						inactiveColumns.push(getTitleName(columns[i]));
					}
				}
				return inactiveColumns;
			} else {
				return null;
			}
		},


		getTitleName : function(directiveName){
	        return getTitleName(directiveName);
    	},

    	getColumnData : function(){
    		return columnData;
    	},

    	setColumnData : function(newColumnData){
    		columnData = newColumnData;
    	}

	};

}]);