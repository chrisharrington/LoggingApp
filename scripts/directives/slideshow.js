Logger.app.directive("slideshow", function ($timeout, imageLoader) {
	return {
		restrict: "E",
		templateUrl: "templates/slideshow.html",
		scope: {
			urls: "="
		},
		link: function(scope, element) {
			$("h3").click(function() {
				scope.$apply(function() {
					slideImages(index++, element);
					if (index > urls.length-1)
						index = 0;
				});
			});

			$(element).find("div.image-container.current").on(whichTransitionEvent(), function() {
				scope.$apply(function() {
					scope.sliding = false;
					scope.swap = !scope.swap;

//							var current = $(element).find("div.image-container.current"), next = $(element).find("div.image-container.next");
//							current.removeClass("current").addClass("next");
//							next.removeClass("next").addClass("current");
				});
			});

			scope.loading = true;
			scope.current = "";
			scope.sliding = false;
			scope.swap = true;

			var index = 0, urls = scope.urls;

			imageLoader.load(urls).then(function() {
				scope.loading = false;

			});

			function slideImages(index, element) {
				scope.sliding = true;
				$(element).find("div.image-container.current").css("background-image", "url('" + urls[index++] + "')");
				$(element).find("div.image-container.next").css("background-image", "url('" + urls[index] + "')");
			}
		}
	};
});

function whichTransitionEvent(){
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition':'transitionend',
		'OTransition':'oTransitionEnd',
		'MozTransition':'transitionend',
		'WebkitTransition':'webkitTransitionEnd'
	}

	for(t in transitions){
		if( el.style[t] !== undefined ){
			return transitions[t];
		}
	}
}
