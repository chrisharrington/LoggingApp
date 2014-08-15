Logger.app.directive("slideshow", function ($timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/slideshow.html",
		scope: {
			urls: "="
		},
		link: function(scope, element) {
			scope.loading = true;

			$timeout(function() {
				imagesLoaded($(element).find("img"), function() {
					scope.$apply(function() {
						scope.loading = false;

						showImage(0);
						setInterval(function () {
							var index = parseInt($(element).find("div.image-container.visible").attr("index"));
							showImage(index = (index == scope.urls.length - 1) ? 0 : (index + 1));
						}, 5000);
					});
				});
			});

			function showImage(index) {
				$(element).find("div.image-container.visible").removeClass("visible");
				$($(element).find("div.image-container")[index]).addClass("visible");
			}
		}
	};
});