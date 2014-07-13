var Logger = window.Logger || {};

window.__previousRoute = "";

Logger.Page = function(params) {
	this._validateParams(params);
	this._animationSpeed = 500;

	var me = this;
	if (!(params.route instanceof Array))
		params.route = [params.route];

	$.each(params.route, function() {
		Path.map(this).to(function () {
			var root = params.root;

			me.init = root.init;
			me.load = root.load;
			me.unload = root.unload;
			me.route = params.route;
			me.navigate = function(routeParameters) { me.navigate(params.route[0], routeParameters || {}); };

			me._setView(params, this.params);
		}).enter(function() {
			if (params.root.beforeLoad)
				params.root.beforeLoad();
		}).exit(function () {
			window.__previousRoute = params.route;
			var unload = params.root.unload;
			setTimeout(function() {
				if (unload)
					unload();
			}, me._animationSpeed);
		});
	});

	return this;
};

Logger.Page.build = function(params) {
	return new Logger.Page(params);
};

Logger.Page.prototype.navigate = function (route, params) {
	route = route ? route : this.route;
	for (var name in params)
		route = route.replace(":" + name, params[name]);
	appNav.changeHash(route);
};

Logger.Page.prototype._setView = function (params, routeArguments) {
	var me = this;
	$.get(this._getUrlFromParams(params, routeArguments)).then(function(html) {
		window.scrollTo(0, 0);

		var sections = $("section.content-container, section.off-screen-content-container");
		var container = $("section.content-container");
		var offScreen = $("section.off-screen-content-container").attr("class", "off-screen-content-container").addClass(params.style).empty().html(html);

		var back = window.__isBack && !me._isForward(window.location.hash);
		if (back)
			offScreen.addClass("left");
		else
			offScreen.removeClass("left");

		me._addToHistory(window.location.hash);
		sections.transition({ x: back ? "100%" : "-100%" }, !window.__previousRoute ? 0 : me._animationSpeed, "ease", function () {
			sections.removeAttr("style");
			offScreen.removeClass("off-screen-content-container").addClass("content-container");
			container.removeClass("content-container").addClass("off-screen-content-container").empty();
			me._initializePage(offScreen, params, routeArguments);
		});
	});
};

Logger.Page.prototype._initializePage = function(container, params, routeArguments) {
	if (this.init && !this._initFired) {
		this.init(container);
		this._initFired = true;
	}
	if (this.load)
		this.load(container, {
			routeArguments: routeArguments,
			previousRoute: window.__previousRoute,
			isBack: window.__isBack
		});
	$(document).scrollTop();

	history.replaceState({ isBack: true }, "");
	window.__isBack = false;
};

Logger.Page.prototype._getUrlFromParams = function(params, routeArguments) {
	var url = params.view;
	if (url instanceof Function)
		url = url();
	for (var name in routeArguments)
		url = url.replace(":" + name, routeArguments[name].replace(/-/g, " "));
	return url;
};

Logger.Page.prototype._validateParams = function(params) {
	if (!params)
		throw new Error("Missing page parameters.");
	if (!params.root)
		throw new Error("Missing page root parameter.");
	if (!params.view)
		throw new Error("Missing page view.");
	if (!params.route)
		throw new Error("Missing page route.");
};

Logger.Page.prototype._addToHistory = function(route) {
	var histories = JSON.parse(window.sessionStorage.getItem("history"));
	if (!histories)
		histories = [];
	if (histories.length > 20)
		histories.shift();
	histories.push(route);
	window.sessionStorage.setItem("history", JSON.stringify(histories));
};

Logger.Page.prototype._isForward = function(route) {
	var histories = JSON.parse(window.sessionStorage.getItem("history"));
	return histories[histories.length-2] === route && histories[histories.length-1] === histories[histories.length-3];
};

$(window).on("popstate", function(e) {
	if (e.originalEvent.state && e.originalEvent.state.isBack)
		window.__isBack = true;
});