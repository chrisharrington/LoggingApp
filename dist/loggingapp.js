Logger.app.controller("header", function($scope) {

});;Logger.app.controller("logs", ["$scope", function($scope) {
	$scope.logs = [
		{
			name: "Running",
			measurements: [
				{ name: "Duration", value: "20 minutes" },
				{ name: "Distance", value: "2 km" }
			],
			tags: [
				{ name: "Sunny" },
				{ name: "With friends" }
			],
			pictures: [
				"http://blog.zensorium.com/wp-content/uploads/2014/04/running-21.jpg",
				"http://cdn.business2community.com/wp-content/uploads/2014/04/running1.jpg"
			]
		},
		{
			name: "Swimming",
			measurements: [
				{ name: "Duration", value: "40 minutes" },
				{ name: "Laps", value: "10" }
			],
			tags: [],
			location: {
				url: "//maps.googleapis.com/maps/api/staticmap?key=AIzaSyAiDv6aOjWSHij6SFkpptsIYef6OEnb-xM&zoom=14&size=376x200&scale=2&markers=Cardel Place, Calgary"
			}
		}
	];

	function _getImageSize() {

	}
}]);;Logger.app.controller("new-log", ["$scope", "newLog", function($scope, newLog) {
	newLog.init($scope);
	newLog.load($scope);
}]);

Logger.app.factory("newLog", function($rootScope, $timeout, once, feedback, collectionRepository) {
	var _measurements = [];
	var _tags = [];
	var _validating = false;

	return {
		init: function() {
			once("new-log-page", function() {
				$rootScope.$on("measurementAdded", function(event, args) {
					_measurements.push({ name: args.name, value: args.quantity + (args.units ? " " + args.units : "") });
				});

				$rootScope.$on("tagAdded", function(event, args) {
					_tags.push({ name: args.name });
				});
			});
		},

		load: function(scope) {
			scope.name = "";
			scope.collection = "";
			scope.location = true;
			scope.nameError = false;

			scope.getCollections = collectionRepository.contains;

			scope.save = function() {
				if (!_validate())
					return;

				feedback.message("boogity");
			};

			scope.saveAndAdd = function() {
				scope.save();
			};

			scope.clearFeedback = function() {
				if (!_validating)
					feedback.hide();

				_validating = false;
			};

			scope.$on("onNameError", function(event, message) {
				feedback.message(message);
				scope.nameError = true;
			});

			function _validate() {
				_validating = true;
				if (!scope.name || scope.name == "")
					return !scope.$broadcast("onNameError", "The name is required.");
			}
		}
	};
});;Logger.app.controller("new-measurement", function($scope, $rootScope, $timeout, feedback) {
	$scope.name = "";
	$scope.quantity = "";
	$scope.units = "";

	$scope.add = function() {
		if (!_validate())
			return;

		$rootScope.$emit("measurementAdded", {
			name: $scope.name,
			quantity: $scope.quantity,
			units: $scope.units
		});
		history.back();
	};

	$scope.cancel = function() {
		history.back();
	};

	$timeout(function() {
		$rootScope.$broadcast("newMeasurementLoaded");
	}, 100);

	function _validate() {
		var error;
		if ($scope.form.name.$error.required)
			error = "The name is required.";
		else if (!$scope.form.quantity.$valid) {
			if ($scope.quantity == "")
				error = "The quantity is required.";
			else
				error = "The quantity is invalid.";
		}
		if (error) {
			feedback.message(error);
			return false;
		} else {
			feedback.hide();
			return true;
		}
	}
});;Logger.app.controller("new-tag", function($scope, $rootScope, $timeout, feedback) {
	$scope.name = "";

	$scope.add = function() {
		if (!_validate())
			return;

		$rootScope.$emit("tagAdded", {
			name: $scope.name
		});
		history.back();
	};

	$scope.cancel = function() {
		history.back();
	};

	$timeout(function() {
		$rootScope.$broadcast("newTagLoaded");
	}, 100);

	function _validate() {
		var error;
		if ($scope.form.name.$error.required)
			error = "The name is required.";

		if (error) {
			feedback.message(error);
			return false;
		} else {
			feedback.hide();
			return true;
		}
	}
});;Logger.app.directive("autocomplete", function() {
	var _first = true;
	var _selected = true;

	return {
		restrict: "E",
		templateUrl: "templates/autocomplete.html",
		scope: {
			placeholder: "@",
			get: "=",
			value: "=",
			tabindex: "@tab",
			ngModel: "="
		},
		link: function(scope, element) {
			if (_first) {
				window.addEventListener("resize", function() {
					scope.$apply(function() {
						scope.containerWidth = $(element).width();
					});
				});
			}

			_first = false;
			scope.visible = true;
			scope.containerWidth = $(element).width();

			scope.select = function(result) {
				scope.ngModel = scope.text = result.name;
				scope.visible = false;
				_selected = true;
			};

			scope.$watch("text", function(value) {
				var localSelected = _selected;
				_selected = false;
				if (localSelected)
					return;

				if (value == "") {
					scope.visible = false;
					scope.results = [];
				} else {
					scope.get(value).then(function (results) {
						scope.visible = results.length > 0;
						scope.results = results;
					});
				}
			});
		}
	}
});;Logger.app.directive("checkbox", function($sce) {
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
				if (target.hasClass("fa-question") || target.parents("modal").length > 0)
					return;

				scope.checked = !scope.checked;
			};

			scope.showModal = function (event) {
				scope.showing = event ? $(event.target).offset() : true;
			};

			scope.hideModal = function () {
				scope.showing = false;
			};
		}
	};
});;Logger.app.directive("dropdown", ["uuid", function(uuid) {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			options: "=options",
			placeholder: "@placeholder",
			name: "@name",
			ngModel: "="
		},
		compile: function(e) {
			return function(scope, element, attributes) {
				var first = true;

				$(element).on("focus", "input", function() {
					$(element).find(">div").addClass("focus");
				});
				$(element).on("blur", "input", function() {
					$(element).find(">div").removeClass("focus");
				});

				if (!scope.ngModel || scope.ngModel == "")
					scope.ngModel = { name: "", id: "" };

				scope.emptyAllowed = attributes.emptyAllowed === "";
				scope.visible = false;
				scope.selected = "";
				scope.selectedId = undefined;

				scope.show = function(event) {
					if ($(event.target).parents(".options-container").length == 0)
						scope.visible = true;
				};

				scope.hide = function() {
					scope.visible = false;
				};

				scope.select = function(option) {
					scope.hide();
					scope.ngModel = { name: option.name, id: option.id };
				};

				scope.containerWidth = $(element).width();

				if (first) {
					scope.id = uuid.create();
					first = false;

					$(window).on("resize", function() {
						scope.$apply(function() {
							scope.containerWidth = $(element).width();
						});
					});

					$(document).on("click", function (event) {
						scope.$apply(function() {
							if ($(event.target).parents("[dropdown-id='" + scope.id + "']").length == 0) {
								scope.hide();

								return false;
							}
						});
					});
				}

			}
		}
	}
}]);;Logger.app.directive("focus", function() {
	return function(scope, element, attributes) {
		scope.$on(attributes.focus, function() {
			$(element).focus();
		});
	};
});;Logger.app.directive("infoInput", ["$sce", function($sce) {
	return {
		restrict: "E",
		templateUrl: "templates/infoInput.html",
		scope: {
			placeholder: "@placeholder",
			type: "@type",
			name: "@name",
			focus: "@focus",
			ngModel: "=",
			tabindex: "@"
		},
		compile: function (element) {
			$(element).removeAttr("tabindex");
			if ($(element).attr("required"))
				$(element).find("input").prop("required", true);
			$(element).on("focus", "input", function() {
				$(element).find(">div").addClass("focus");
			});
			$(element).on("blur", "input", function() {
				$(element).find(">div").removeClass("focus");
			});

			return function (scope, element, attributes) {
				scope.info = $sce.trustAsHtml(attributes.info);
				scope.showing = false;

				scope.showModal = function () {
					scope.showing = true;
				};

				scope.hideModal = function () {
					scope.showing = false;
				};
			}
		}
	}
}]);;Logger.app.directive("menuItem", function() {
	return {
		restrict: "E",
		templateUrl: "templates/menuItem.html",
		transclude: true,
		scope: {
			icon: "@",
			url: "@",
			destination: "@"
		}
	};
});;Logger.app.directive("modal", function() {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: {
			title: "@header",
			className: "@class",
			close: "=",
			show: "="
		},
		link: function(scope, element, attributes) {
			scope.titleVisible = scope.title !== undefined && scope.title !== "";

			scope.$watch("show", function() {
				var overlay = $(element).find(".modal-overlay");
				overlay.width($(window).width());
				overlay.height($(window).height());
			});
		}
	}
});;Logger.app.directive("ngSlideshow", function ($compile) {
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
});;Logger.app.directive("text", function() {
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
});;Logger.app.directive("uniqueId", ["uuid", function(uuid) {
	return {
		link: function(scope, element, attributes) {
			$(element).attr("unique-id", uuid.create());
		}
	}
}]);;Array.prototype.exists = function(func) {
	for (var i = 0; i < this.length; i++)
		if (func(this[i]))
			return true;
	return false;
};

Array.prototype.where = function(func) {
	var result = [];
	for (var i = 0; i < this.length; i++)
		if (func(this[i]))
			result.push(this[i]);
	return result;
};

Array.prototype.first = function(func) {
	return this.where(func)[0];
};;
Date.prototype.toApplicationString = function() {
	return this.getFullYear() + "-" + (this.getMonth() + 1).toString().padLeft("00") + "-" + this.getDate().toString().padLeft("00") + " " + this.getHours().toString().padLeft("00") + ":" + this.getMinutes().toString().padLeft("00") + ":" + this.getSeconds().toString().padLeft("00");
};

Date.prototype.toReadableDateString = function () {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear();
};

Date.prototype.toLongDateString = function () {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[this.getDay()] + ", " + months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear();
};

Date.prototype.toShortDateString = function () {
	return this.getFullYear() + "-" + (this.getMonth() + 1).toString().padLeft("00") + "-" + this.getDate().toString().padLeft("00");
};

Date.prototype.toShortTimeString = function() {
	var hours = this.getHours();
	if (hours > 12)
		hours -= 12;
	if (hours == 0)
		hours = 12;
	return hours + ":" + this.getMinutes().toString().padLeft(2, "0") + " " + (this.getHours() >= 12 ? "PM" : "AM");
};

Date.prototype.toDateTimeString = function () {
	return this.toShortDateString() + " " + this.toLocaleTimeString();
};

Date.prototype.toServerReadableString = function () {
	return this.getFullYear() + "-" + (this.getMonth() + 1).toString().padLeft(2, "0") + "-" + this.getDate().toString().padLeft(2, "0") + " " + this.getHours().toString().padLeft(2, "0") + ":" + this.getMinutes().toString().padLeft(2, "0") + ":" + this.getSeconds().toString().padLeft(2, "0");
};

Date.prototype.clone = function () {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};

Date.getPastMonthRanges = function (count) {
	var dates = new Array();
	var beginning = new Date();
	beginning.setDate(1);
	for (var i = 0; i < count; i++) {
		var end = beginning.clone();
		end.setMonth(end.getMonth() + 1);
		end.setDate(end.getDate() - 1);
		dates.push({ start: beginning.clone(), end: end.clone() });
		beginning.setMonth(beginning.getMonth() - 1);
	}
	return dates;
};

Date.getPastWeekRanges = function (weeks) {
	var dates = new Array();
	var sunday = Date.getBeginningOfWeek();
	for (var i = 0; i < weeks; i++) {
		var end = sunday.clone();
		end.setDate(end.getDate() + 6);
		dates.push({ start: sunday.clone(), end: end.clone() });
		sunday.setDate(sunday.getDate() - 7);
	}
	return dates;
};

Date.getBeginningOfWeek = function (date) {
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	if (!date)
		date = new Date();
	while (date.getDay() != 0)
		date.setDate(date.getDate() - 1);
	return date;
};

Date.getMonthString = function(monthIndex) {
	return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
};

Date.getDayString = function (dayIndex) {
	return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
};

Date.parseUTC = function (string) {
	var date = new Date(Date.parse(string));
	date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
	return date;
};

Date.prototype.addDays = function (count) {
	var date = this.clone();
	date.setDate(date.getDate() + count);
	return date;
};

if (!Date.prototype.toISOString) {
	Date.prototype.toISOString = function () {
		function pad(n) { return n < 10 ? '0' + n : n }
		return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
	};
};
Number.prototype.toSizeString = function() {
	if (this < 1000)
		return this + " b";
	if (this >= 1000 && this < 1000000)
		return (this / 1000).toFixed(2) + " kb";
	if (this >= 1000000 && this < 1000000000)
		return (this / 1000000).toFixed(2) + " mb";
};;
String.prototype.endsWith = function(value) {
	if (!value)
		return false;
	if (value.length > this.length)
		return false;

	var end = this.substring(this.length - value.length);
	return end === value;
};

String.prototype.startsWith = function(value) {
	if (!value)
		return false;
	if (value.length > this.length)
		return false;

	return value === this.substring(0, value.length);
};

String.prototype.formatForUrl = function () {
	return this.replace(/[^a-z0-9]/gi, '-').toLowerCase();
};

String.prototype.capitalize = function() {
	return this[0].toUpperCase() + this.substring(1);
};

String.prototype.padLeft = function (paddingValue) {
	return String(paddingValue + this).slice(-paddingValue.length);
};;function scope(selector) {
	var scope = angular.element($(selector)[0]).scope();
	console.log(scope);
	return scope;
};Logger.ANIMATION_SPEED = 250;

Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/logs", { templateUrl: "views/logs.html", controller: "logs" })
		.when("/new-log", { templateUrl: "views/newLog.html", controller: "new-log" })
		.when("/new-log/measurement", { templateUrl: "views/newMeasurement.html", controller: "new-measurement" })
		.when("/new-log/tag", { templateUrl: "views/newTag.html", controller: "new-tag" })
		.otherwise({ redirectTo: "/new-log" });
}]);

Logger.app.run(function($rootScope, collectionRepository, logRepository, $q) {
	var history = [];

	$rootScope.menuVisible = false;

	$rootScope.showMenu = function() {
		$rootScope.menuVisible = true;
	};

	$rootScope.hideMenu = function() {
		$rootScope.menuVisible = false;
	};

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		_handleBack();
	});

	$q.all([_loadCollections(), _loadLogs()]).then(function(result) {
		var collections = result[0], logs = result[1];
		for (var i = 0; i < collections.length; i++) {
			for (var j = 0; j < logs.length; j++) {
				if (collections[i].id == logs[j].collectionId) {
					if (!collections[i].logs)
						collections[i].logs = [];
					collections[i].logs.push(logs[j]);
				}
			}
		}

		$rootScope.collections = collections;
	});

	function _loadCollections() {
		return collectionRepository.all();
	}

	function _loadLogs() {
		return logRepository.all().then(function(logs) {
			$rootScope.logs = logs;
			return logs;
		});
	}

	function _handleBack() {
		if (history.length > 25)
			history.shift();
		history.push(window.location.hash);

		$rootScope.isBack = _isBack();
	}

	function _isBack() {
		if (!history || history.length < 3)
			return false;

		var isBack = history[history.length-1] === history[history.length-3];
		if (isBack) {
			history.pop();
			history.pop();
		}
		return isBack;
	}
});

;Logger.app.factory("collectionRepository", function($http) {
	return {
		all: function() {
			return $http.get("scripts/fixtures/collections.json").then(function(result) {
				result.data.sort(function (first, second) {
					if (first.name < second.name)
						return -1;
					if (first.name == second.name)
						return 0;
					return 1;
				});

				return result.data;
			});
		},

		contains: function(string) {
			return all().then(function(all) {
				var collections = [];
				if (!string || string == "")
					return collections;

				string = string.toLowerCase();
				for (var i = 0; i < all.length; i++)
					if (all[i].name.toLowerCase().indexOf(string) > -1)
						collections.push(all[i]);
				return collections;
			});
		}
	}
});
;Logger.app.factory("logRepository", function($http) {
	return {
		all: function() {
			return $http.get("scripts/fixtures/logs.json").then(function(result) {
				result.data.sort(function (first, second) {
					if (first.name < second.name)
						return -1;
					if (first.name == second.name)
						return 0;
					return 1;
				});

				return result.data;
			});
		}
	}
});
;Logger.app.factory("feedback", function($rootScope, $timeout) {
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
});;Logger.app.factory("once", function() {
	var keys = {};

	return function(key, func) {
		if (keys[key])
			return;

		keys[key] = true;
		func();
	};
});;Logger.app.factory("selectedLog", function() {
	return {
		get: function() {
			if (!Logger.selectedLog) {
				var raw = window.localStorage.getItem("selected-log");
				if (raw)
					Logger.selectedLog = JSON.parse(raw);
			}
			return Logger.selectedLog;
		},

		set: function(log) {
			window.localStorage.setItem("selected-log", JSON.stringify(log));
			Logger.selectedLog = log;
		}
	}
});;Logger.app.factory("uuid", function() {
	return {
		create: function() {
			function _p8(s) {
				var p = (Math.random().toString(16) + "000000000").substr(2,8);
				return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
			}
			return _p8() + _p8(true) + _p8(true) + _p8();
		},

		empty: function() {
			return "00000000-0000-0000-0000-000000000000";
		}
	};
});