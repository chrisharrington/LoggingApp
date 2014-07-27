Logger.app.factory("measurementRepository", ["$http", function($http) {
	return {
		log: function(logId) {
			return $http.get("scripts/fixtures/measurements.json").then(function(result) {
				return result.data;
			});
		}
	}
}]);