module.exports = {
	root: require("./root"),
	style: require("./style"),
	logs: require("./logs"),

	init: function(app) {
		for (var name in this)
			if (name != "init")
				this[name].call(this, app);
	}
};