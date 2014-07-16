Logger.app.directive("ngSlideshow", function ($compile) {
	return {
		restrict: "A",
		templateUrl: "templates/slideshow.html",
		compile: function(scope, element, attributes) {
			var pictures = scope.$eval(attributes.ngSlideshow);
			if (!pictures || pictures.length == 0)
				return;

			scope.pictures = pictures;

			//return $compile(element);
		},
		link: function(scope, element, attributes) {
			debugger;
		}
	};
});