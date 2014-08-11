Logger.app.factory("collections", function($http) {
	return {
		contains: function(string) {
			return $http.get("scripts/fixtures/collections.json").then(function(result) {
				result.data.sort(function(first, second) {
					if (first.name < second.name)
						return -1;
					if (first.name == second.name)
						return 0;
					return 1;
				});

				var collections = [];
				if (!string || string == "")
					return collections;

				string = string.toLowerCase();
				for (var i = 0; i < result.data.length; i++)
					if (result.data[i].name.toLowerCase().indexOf(string) > -1)
						collections.push(result.data[i]);
				return collections;
			});
		}
	}
});
