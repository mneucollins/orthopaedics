(function() {
	'use strict';

	angular
		.module('patientRowModule')
		.directive('preRegisterColumn',preRegisterColumn);

	function preRegisterColumn(){
		return {
			replace : true,
			restrict : 'E',
			scope : {
				patient : "="
			},
			templateUrl : '/app/modules/patient-row/pre-register-column.html',
			controller : preRegisterColumnController

		};

	}

	/* @ngInject */
	function preRegisterColumnController($scope, PatientStoreService){

		$scope.prIndex = !!$scope.patient.prIndex ?
			$scope.patient.prIndex : '-';
		// var preRegisteredPatients = PatientStoreService.getPreRegisteredPatients();
		// var preRegisteredPatientsIds = _.pluck(preRegisteredPatients, "_id");

		// $scope.patient.prIndex = preRegisteredPatientsIds.indexOf($scope.patient.id) == -1 ? "-" : preRegisteredPatientsIds.indexOf($scope.patient.id) + 1 ;
	

	}

})();