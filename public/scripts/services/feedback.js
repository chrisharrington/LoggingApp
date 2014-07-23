Logger.app.factory("feedback", function($rootScope) {
	return {
		message: function(message) {
			$rootScope.feedbackText = message;
		},

		hide: function() {
			$rootScope.feedbackText = "";
		}
	}
});

Logger.app.directive("feedback", ["$rootScope", function($rootScope) {
	$rootScope.feedbackText = "";

	return {
		restrict: "E",
		templateUrl: "templates/feedback.html",
		link: function(scope, element, attributes) {
			scope.text = $rootScope.feedbackText;

			scope.close = function() {
				$rootScope.feedbackText = "";
			};

			$rootScope.$watch("feedbackText", function(value) {
				scope.text = value;
				scope.visible = value && value != "";
			});
		}
	};
}]);