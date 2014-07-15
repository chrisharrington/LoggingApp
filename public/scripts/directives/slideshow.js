Logger.app.directive("ngSlideshow", function () {
	return {
		restrict: "A",
		compile: function(element, attributes) {
			$(element).html("<div class=\"spinner\"><img src=\"[[url]]\" ng-repeat=\"url in " + attributes.ngSlideshow + "\" /></div>");
		},
		link: function(scope, element, attributes) {
//			$(element).find("img").each(function() {
//				var width = $(this).width();
//				var height = $(this).height();
//				var clipSize = 200;
//				var x = ((width - clip/2) - clip/2);
//				var y = ((height - clip/2) - clip/2);
//				$(this).css("clip", "rect(" + y + "px, " + x + "px, " + x + "px, " + y + "px)");
//			});
		}
	};
});