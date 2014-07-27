Logger.app.factory("feedback", function($rootScope, $timeout) {
	return {
		message: function(message) {
			if (!message)
				this.hide();
			else
				$rootScope.feedbackText = message;
		},

		hide: function() {
			$rootScope.feedbackText = "";
		}
	}
});

Logger.app.directive("feedback", function($rootScope) {
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
				if (value != "")
					scope.text = value;
				scope.visible = value && value != "";
			});
		}
	};
});