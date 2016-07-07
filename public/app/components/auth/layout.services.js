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

    	var imaging = {title:"Imaging",style:"imagingRowSmall",len:6};
    	var labs = {title:"Labs",style:"labsRowSmall",len:6};

    	if(isImaging){
    		imaging = {title:"Imaging",style:"imagingRow",len:14};
			labs = {title:"Labs",style:"labsRow",len:14};    		
    	}

        switch (directiveName){
            case "action-column" : return {title:"Button",style:"buttonRow",len:11};
            case "age-column" : return {title:"Age",style:"ageRow",len:5};
            case "appt-time-column" : return {title:"Appt Time",style:"apptTimeRow",len:10};
            case "appt-type-column" : return {title:"Type",style:"typeRow",len:6};
            case "at-column" : return {title:"AT Entry",style:"atRow",len:10};
            case "fp-column" : return {title:"FP Entry",style:"fpRow",len:10};
            case "fc-column" : return {title:"FC",style:"fcRow",len:5};
            case "imaging-column" : return imaging;
            case "labs-column" : return labs;
            case "name-column" : return {title:"Name",style:"nameRow",len:13};
            case "physician-column" : return {title:"Physician",style:"physicianRow",len:13};
            case "room-number-column" : return {title:"Room",style:"roomRow",len:5};
            case "wait-status-column" : return {title:"Status",style:"statusRow",len:12};
            case "wait-total-column" : return {title:"Total",style:"totalRow",len:6};
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

		getActiveColumns : function(){
			if(layout){
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

		getInactiveColumns : function(){
			if(layout){
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