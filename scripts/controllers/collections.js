Logger.app.controller("collections", function($scope, once, authentication, collections) {
	authentication.check();
	collections.load($scope);
});

Logger.app.factory("collections", function($rootScope, collectionRepository) {
	return {
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