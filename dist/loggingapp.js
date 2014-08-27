Logger.app.controller("collections", function($scope, once, collections) {
	once("collections-page", function() {
		collections.init($scope);
	});
	collections.load($scope);
});

Logger.app.factory("collections", function($rootScope, collectionRepository) {
	return {
		init: function() {

		},

		load: function(scope) {
			$rootScope.title = "Collections";

			scope.collections = [];
			scope.loading = true;

			collectionRepository.all().then(function(collections) {
				scope.collections = collections;
				scope.loading = false;
			});
		}
	};
});;Logger.app.controller("header", function($scope) {

});;Logger.app.controller("logs", function(once, $rootScope, $scope, logRepository) {

	$rootScope.title = "Logs";

	$scope.logs = [];
	$scope.loading = true;

	logRepository.latest().then(function(logs) {
		$scope.loading = false;
		$scope.logs.pushAll(logs);
	});
});

Logger.app.factory("logs", function() {
	return {
		init: function() {

		},

		load: function() {

		}
	}
});;Logger.app.controller("new-log", ["$scope", "newLog", function($scope, newLog) {
	newLog.init($scope);
	newLog.load($scope);
}]);

Logger.app.factory("newLog", function($rootScope, $timeout, once, feedback, collectionRepository, logRepository, $q) {
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
			$rootScope.title = "New Log";

			scope.name = "";
			scope.collection = "";
			scope.location = true;
			scope.nameError = false;

			scope.getCollections = collectionRepository.contains;

			scope.save = function() {
				_save().then(function() {
					window.location.hash = "logs";
				});
			};

			scope.saveAndAdd = function() {
				_save().then(function() {
					alert("add entry");
				})
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
				return true;
			}

			function _save() {
				var deferred = $q.defer();

				if (_validate()) {
					scope.$broadcast("onLogAdded", {
						name: scope.name,
						collection: scope.collection,
						location: scope.location
					});
					deferred.resolve();
				}

				return deferred.promise;
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
});;Logger.app.directive("gravatar", function(crypto) {
	return {
		restrict: "E",
		templateUrl: "templates/gravatar.html",
		scope: {
			email: "@",
			size: "@"
		},
		link: function(scope) {
			scope.hash = crypto.md5(scope.email);
		}
	}
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
}]);;Logger.app.directive("logTile", function() {
	return {
		restrict: "E",
		templateUrl: "templates/logTile.html",
		scope: {
			log: "="
		}
	};
});;Logger.app.directive("menuItem", function() {
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
});;Logger.app.directive("slideshow", function ($interval, imageLoader) {
	var imageIndex = -1, urls = [];

	return {
		restrict: "E",
		templateUrl: "templates/slideshow.html",
		scope: {
			urls: "="
		},
		link: function(scope, element) {
			element.find("div.image-container.first").on("transitionend oTransitionEnd webkitTransitionEnd", function() {
				scope.$apply(function() {
					scope.sliding = false;
					scope.swap = !scope.swap;
				});
			});

			scope.loading = true;
			scope.current = "";
			scope.sliding = false;
			scope.swap = true;

			var index = 0, urls = scope.urls;

			imageLoader.load(urls).then(function() {
				$interval(function() {
					scope.sliding = true;
					if (index > urls.length-1)
						index = 0;
				}, 5000);

				scope.loading = false;
				$(element).find("div.image-container.current").css("background-image", "url('" + urls[0] + "')");
				if (urls.length > 1)
					$(element).find("div.image-container.next").css("background-image", "url('" + urls[1] + "')");
			});
		}
	};
});
;Logger.app.directive("spinner", function() {
	return {
		restrict: "E",
		templateUrl: "templates/spinner.html",
		scope: {
			colour: "@",
			borderWidth: "@",
			size: "@",
			backgroundColour: "@"
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
};

Array.prototype.pushAll = function(array) {
	for (var i = 0; i < array.length; i++)
		this.push(array[i]);
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
		.when("/collections", { templateUrl: "views/collections.html", controller: "collections" })
		.otherwise({ redirectTo: "/logs" });
}]);

Logger.app.run(function($rootScope, collectionRepository, logRepository, $q, menu) {
	$rootScope.title = "";
	$rootScope.user = {
		email: "chrisharrington99@gmail.com"
	};

	menu.init();

	$("h3").on("click", function() {
		alert(window.location.href);
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
});

;Logger.app.factory("menu", function($rootScope, once) {
	return {
		init: function() {
			once("menu-init", function() {
				$(window).on("click", function(e) {
					var target = $(e.target);
					if (target.attr("menu-trigger") !== "" && target.attr("menu") !== "" && (target.parents("[menu]").length === 0 || target.parents("menu-item").length !== 0 || target.parents("[menu-item]").length !== 0))
						$rootScope.$apply(function() {
							$rootScope.hideMenu();
						});
				});

				$(window).on("resize", _setMenuHeight);
				$(_setMenuHeight);

				function _setMenuHeight() {
					$("[menu]").height($(window).height() - 50);
				}
			});

			$rootScope.menuVisible = false;

			$rootScope.showMenu = function() {
				$rootScope.menuVisible = true;
			};

			$rootScope.hideMenu = function() {
				$rootScope.menuVisible = false;
			};
		}
	}
});;Logger.app.factory("crypto", function() {
	return {
		md5: function(plaintext) {
			return CryptoJS.MD5(plaintext).toString();
		}
	}
});;Logger.app.factory("collectionRepository", function($http) {
	var that;
	return that = {
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
			return that.all().then(function(all) {
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
		},

		latest: function() {
			return $http.get("scripts/fixtures/latestLogs.json").then(function(result) {
				result.data.sort(function (first, second) {
					return first.created < second.created ? -1 : first.created == second.created ? 0 : 1;
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
});;Logger.app.service("imageLoader", function($q) {
	return {
		load: function(urls) {
			var deferred = $q.defer(), count = urls.length, images = [];
			for (var i = 0; i < urls.length; i++) {
				var image = $("<img />", { style: "display: none !important", src: urls[i] });
				images.push(image);
				$("body").append(image.on("load", function () {
					count--;
					if (count == 0) {
						_removeImages(images);
						deferred.resolve();
					}
				}));
			}
			return deferred.promise;
		}
	};

	function _removeImages(images) {
		for (var i = 0; i < images.length; i++)
			images[i].remove();
	}
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
});;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,
g)).finalize(a)}}});var k=m.algo={};return m}(Math);
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);