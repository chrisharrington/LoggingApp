Logger.app.directive("checkbox", function($sce) {
	return {
		restrict: "E",
		templateUrl: "templates/checkbox.html",
		transclude: true,
		scope: {
			checked: "="
		},
		link: function(scope, element, attributes) {
			scope.info = $sce.trustAsHtml(attributes.info);
			scope.showing = false;
			scope.infoVisible = attributes.info && attributes.info != "";

			scope.toggle = function(event) {
				var target = $(event.target);
				if (target.hasClass("fa") || target.parents("modal").length > 0)
					return;

				scope.checked = !scope.checked;
			};

			scope.showModal = function () {
				scope.showing = true;
			};

			scope.hideModal = function () {
				scope.showing = false;
			};
		}
	};
});