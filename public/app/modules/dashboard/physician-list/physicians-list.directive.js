angular.module('dashboardModule')
.directive('physiciansList',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			selectedPhys: "=?"
		},
		templateUrl : '/app/modules/dashboard/physician-list/physicians-list.html',
		controller:['$scope', '$rootScope', 'AuthService', 'Physician', 'PhysicianListService', 
		function($scope, $rootScope, AuthService, Physician, PhysicianListService){

			$scope.selectAll = selectAll;
			$scope.selectPhysician = selectPhysician;

			activate();

			/////////////////////////

			function activate() {
				if(!$scope.selectedPhys)
					$scope.selectedPhys = [];

			    Physician.query(function (physicians) {
			        _.each(physicians, function (element, index, list) {
			            if(_.find($scope.selectedPhys, function (phy) { return phy == element._id;}))
			            	list[index].selected = true;
			            else
			            	list[index].selected = false;
			        });
			        
			        $scope.physicianList = _.filter(physicians, function (phy) {
			            return phy.isActive;
			        });
			        // $scope.physicianList = physicians;
			        resizePhybar(); // método en js/main.js
			    });
			}

		    $scope.$on("fillSchedules", function () {
		        fillSchedules();
		    });
		    
		    $scope.$on("setSelectedPhysicians", function (ev, newList) {
		        _.each($scope.physicianList, function (element, index, list) {
		            if(_.find(newList, function (phy) { return !!phy._id ? phy._id == element._id: phy == element._id;}))
		            	list[index].selected = true;
		            else
		            	list[index].selected = false;
		        });
		        
		        $scope.physicianList = _.filter($scope.physicianList, function (phy) {
		            return phy.isActive;
		        });
		    });

			//////////////////

		    function selectAll() {
		        if ($scope.phySelectAll) {
		        	$scope.phySelectAll = true;
		        	$scope.$emit("selectedPhysiciansChanged", $scope.physicianList);
		        }
		        else {
		        	$scope.phySelectAll = false;
		        	$scope.$emit("selectedPhysiciansChanged", []);
		        } 

		        angular.forEach($scope.physicianList, function (physician) {
		            physician.selected = $scope.phySelectAll;
		        });
		    };

		    function selectPhysician(physician) {
		         
		        physician.selected = !physician.selected;
		        
		        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
		            return physician.selected;
		        });
		        $scope.phySelectAll = selectedPhysicians.length == $scope.physicianList.length;
		        $scope.$emit("selectedPhysiciansChanged", selectedPhysicians);
		    }

		    function fillSchedules() {
		        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
		            return physician.selected;
		        }); 

		        // $rootScope.selectedPhysicians = selectedPhysicians;
		        PhysicianListService.setPhysicianList(selectedPhysicians, function() {
		            $scope.$emit("onPhysiciansSelected", selectedPhysicians);
		        });
		    }

		}]
	};
});