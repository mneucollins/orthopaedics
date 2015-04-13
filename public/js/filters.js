var orthopaedicsFilters = angular.module('orthopaedicsFilters', [])

orthopaedicsFilters.filter('dischargePatientsFilter', function () {
    return function (patients, hideDischarged) {
        if(hideDischarged) 
            return _.filter(patients, function (pat) {
                return pat.currentState != "DC";
            });
        else
            return patients;
    };
}); 


orthopaedicsFilters.filter('deletedPatientsFilter', function () {
    return function (patients, hideDeleted) {
        if(hideDeleted) 
            return _.filter(patients, function (pat) {
                return !pat.isDeleted;
            });
        else
            return _.filter(patients, function (pat) {
                return pat.isDeleted;
            });
    };
}); 