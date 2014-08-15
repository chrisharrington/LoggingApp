Logger.app.factory("logRepository", function($http) {
	return {
		all: function() {
			return $http.get("scripts/fixtures/logs.json").then(function(result) {
				result.data.sort(function (first, second) {
					if (first.name < second.name)
						return -1;
					if (first.name == second.name)
						return 0;
					return 1;
				});

				return result.data;
			});
		},

		latest: function() {
			return this.all().then(function(logs) {
				logs.sort(function(first, second) {
					return first.created < second.created ? -1 : first.created == second.created ? 0 : 1;
				})
			});
		}
	}
});
