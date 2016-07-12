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
        "wait-status-column",
        "wait-total-column"
    ];

    function getTitleName (directiveName){

    	var imaging = {name:"imaging-column",title:"Imaging",style:"imagingRowSmall",len:6};
    	var labs = {name:"labs-column",title:"Labs",style:"labsRowSmall",len:6};

    	if(isImaging){
    		imaging = {name:"imaging-column",title:"Imaging",style:"imagingRow",len:14};
			labs = {name:"labs-column",title:"Labs",style:"labsRow",len:14};    		
    	}

        switch (directiveName){
            case "action-column" : return {name:"action-column",title:"Button",style:"buttonRow",len:11};
            case "age-column" : return {name:"age-column",title:"Age",style:"ageRow",len:5};
            case "appt-time-column" : return {name:"appt-time-column",title:"Appt Time",style:"apptTimeRow",len:10};
            case "appt-type-column" : return {name:"appt-type-column",title:"Type",style:"typeRow",len:6};
            case "at-column" : return {name:"at-column",title:"AT Entry",style:"atRow",len:10};
            case "fp-column" : return {name:"fp-column",title:"FP Entry",style:"fpRow",len:10};
            case "fc-column" : return {name:"fc-column",title:"FC",style:"fcRow",len:5};
            case "imaging-column" : return imaging;
            case "labs-column" : return labs;
            case "name-column" : return {name:"name-column",title:"Name",style:"nameRow",len:13};
            case "physician-column" : return {name:"physician-column",title:"Physician",style:"physicianRow",len:13};
            case "room-number-column" : return {name:"room-number-column",title:"Room",style:"roomRow",len:5};
            case "wait-status-column" : return {name:"wait-status-column",title:"Status",style:"statusRow",len:12};
            case "wait-total-column" : return {name:"wait-total-column",title:"Total",style:"totalRow",len:6};
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
    	}

	};

}]);