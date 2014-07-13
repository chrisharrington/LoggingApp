var Logger = window.Logger || {};

Logger.Page = function(params) {
	this._validateParams(params);

	var me = this;
	params.root.route = params.route;
	params.root.navigate = function(routeParameters) { me.navigate(params.route[0], routeParameters || {}); };
	this.load = params.root.load;
	this.unload = params.root.unload;
	this.init = params.root.init;
	this.preload = params.root.preload;

	if (!(params.route instanceof Array))
		params.route = [params.route];

	$.each(params.route, function() {
		Path.map(this).to(function () {
			if (!me._isAuthorized(params))
				Logger.Welcome.redirect();
			else
				me._setView(params, this.params);
		}).enter(function() {
			if (params.root.enter)
				params.root.enter();
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
	window.location.hash = route;
};

Logger.Page.prototype._isAuthorized = function (params) {
	if (params.isAnonymous)
		return true;
	return Logger.signedInUser() != null;
};

Logger.Page.prototype._setView = function (params, routeArguments) {
	this._resetErrorPanels();

	var me = this;
	var url = params.view;
	if (url instanceof Function)
		url = url();
	for (var name in routeArguments)
		url = url.replace(":" + name, routeArguments[name].replace(/-/g, " "));

	if (me.preload)
		me.preload(routeArguments);

	$.get(url).then(function(html) {
		if (Logger.currentPage && Logger.currentPage.unload)
			Logger.currentPage.unload();
		Logger.currentPage = me;

		var container = $(".content-container")
			.attr("class", "content-container " + params.style)
			.empty()
			.append($("<div></div>").addClass("binding-container").html(html));

		if (me.init && !me._initFired) {
			me.init(container);
			me._initFired = true;
		}
		if (me.load)
			me.load(container, routeArguments);

		me._setTitle(params.title);
		$(document).scrollTop();
	});
};

Logger.Page.prototype._loadData = function() {
	var deferred = new $.Deferred();
	deferred.resolve({});
	return deferred.promise();
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
	if (!params.style)
		throw new Error("Missing page style.");
};

Logger.Page.prototype._setTitle = function(title) {
	if (!title)
		title = "Leaf";
	if (typeof(title) == "function")
		title = title();
	document.title = title;
	Logger.title(title);
};

Logger.Page.prototype._resetErrorPanels = function() {
	$("div.error-code").hide();
	$("section.content-container").show();
};