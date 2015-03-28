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