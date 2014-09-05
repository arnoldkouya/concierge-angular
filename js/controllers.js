
app.controller('mainController', function($scope, $modal, $state, User) {
	$scope.user = {};
	
	User.get(function(data) {
		$scope.user = data;
	});
	
	if (typeof sessvars.branchId === 'undefined' || sessvars.branchId == null || sessvars.branchId == -1 ||
      typeof sessvars.entryPointId === 'undefined' || sessvars.entryPointId == null || sessvars.entryPointId == -1) {
	  var modalInstance = $modal.open({
			backdrop: 'static',
			keyboard: false,
	    templateUrl: 'settings.html',
	    controller: settingsController
	  });
		
	  modalInstance.result.then(function(settings) {
			sessvars.branchId = settings.branch;
			sessvars.entryPointId = settings.entryPoint;
		
			$state.go('/ep');
	  });
	} else {
		$state.go('/ep');
	}
	
});

app.controller('epController', function($scope, $timeout, Services, Queues, Visits, Visit) {
	$scope.services = [];
	$scope.queues = [];
	$scope.queueId = 0;
	$scope.visits = [];
	$scope.visit = {
		services: [],
		parameters: {
			customerName: "",
			mobile: ""
		}
	};
	$scope.alerts = [];
	
	Services.query({ branchId: sessvars.branchId }, function(data) {
			$scope.services = data;
	});
	
	(function getQueues() {
		Queues.query({ branchId: sessvars.branchId }, function(data) {
			
			for(i in data) {
				if(data[i].id == $scope.queueId) {
					data[i].open = true;
					$scope.getVisits();
				} else {
					data[i].open = false;
				}
			}
			
			$scope.queues = data;
			$timeout(getQueues, 15*1000);
		});
	})();
	
	$scope.showVisits = function(id) {
		if($scope.queueId == id) {
			$scope.queueId = 0;
			
			for(i in $scope.queues) {
				if($scope.queues[i].id == id)
					$scope.queues[i].open = false;
			}
			
			return;
		}
		
		for(i in $scope.queues) {
			if($scope.queues[i].id == id)
				$scope.queues[i].open = true;
		}
		
		$scope.queueId = id;
		$scope.getVisits();
	};
	
	$scope.getVisits = function() {
		Visits.query({ branchId: sessvars.branchId, queueId: $scope.queueId }, function(data) {
			$scope.visits = data;
		});
	};
	
	$scope.createVisit = function() {
		Visit.save({ branchId: sessvars.branchId, entryPointId: sessvars.entryPointId }, $scope.visit, function(data) {
			$scope.visit = {
				services: [],
				parameters: {
					customerName: "",
					mobile: ""
				}
			};
			
			$scope.alerts.push({type: "success", msg: "Ticket number " + data.ticketId});
			$timeout(function(){
				$scope.alerts.splice(0, 1);
			}, 5*1000);
		});
	};
	
	$scope.formatTime = function(secsIn) {
	    if(secsIn == -1) {
	        return "";
	    }
	    var hours = parseInt(secsIn / 3600);
	    var remainder = secsIn % 3600;
	    var minutes = parseInt(remainder / 60);
	    var formatted = (hours < 10 ? "0" : "") + hours
	            + ":" + (minutes < 10 ? "0" : "") + minutes;
	    return formatted;
	};
	
});

var settingsController = function ($scope, $modalInstance, Branches, EntryPoints) {
	$scope.branches = [];
	$scope.entrypoints = [];
	$scope.settings = {
		branch: sessvars.branchId,
		entryPoint: sessvars.entryPointId
	};
	
	Branches.query(function(data) {
		$scope.branches = data;
	});
	
	$scope.selectBranch = function() {
		EntryPoints.query({ branchId: $scope.settings.branch }, function(data) {
			$scope.entrypoints = data;
		});
	};
	
	if (typeof sessvars.branchId != 'undefined' || sessvars.branchId != null || sessvars.branchId > 0)
		$scope.selectBranch();
	
	$scope.settingsOK = function() {
		if($scope.settings.branch != undefined && $scope.settings.entryPoint != undefined) {
			return true;
		}
		
		return false;
	}
	
	$scope.ok = function() {
		$modalInstance.close($scope.settings);
	};
	
};