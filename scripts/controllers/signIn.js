Logger.app.controller("sign-in", ["$scope", "signIn", function($scope, signIn) {
	signIn.init($scope);
	signIn.load($scope);
}]);

Logger.app.factory("signIn", function($rootScope, once) {
	return {
		init: function() {
			once("sign-in-page", function() {

			});
		},

		load: function(scope) {

		}
	};
});