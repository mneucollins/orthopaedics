var orthopaedicsDirectives = angular.module('orthopaedicsDirectives', []);

orthopaedicsDirectives.directive('patientList', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onPatientListed', element, attrs);
        }, 1);
    };
});