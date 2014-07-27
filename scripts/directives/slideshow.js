Logger.app.directive("ngSlideshow", function ($compile) {
	return {
		restrict: "A",
		templateUrl: "templates/slideshow.html",
		scope: {
			pictures: "=ngSlideshow"
		},
		link: {
			post: function(scope, element, attributes) {
				var length = $(element).find("img").length;
			}
		}
	};
});