Logger.app.controller("collections", function($scope, once, collections) {
	once("collections-page", function() {
		collections.init($scope);
	});
	collections.load($scope);
});

Logger.app.factory("collections", function($rootScope, collectionRepository) {
	return {
		init: function() {

		},

		load: function(scope) {
			$rootScope.title = "Collections";

			scope.collections = [];
			scope.loading = true;

			collectionRepository.all().then(function(collections) {
				scope.collections = collections;
				scope.loading = false;
			});
		}
	};
});