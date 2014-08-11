Logger.app.directive("text", function() {
	return {
		restrict: "E",
		templateUrl: "templates/text.html",
		scope: {
			type: "@",
			placeholder: "@",
			name: "@",
			tab: "@tabindex",
			focus: "@",
			value: "&",
			ngModel: "=",
			ngKeyup: "="
		},
		compile: function(element) {
			$(element).on("focus", "input", function() {
				$(element).addClass("focus");
			});

			$(element).on("blur", "input", function() {
				$(element).removeClass("focus");
			});
		}
	}
});