module.exports = {
	root: require("./root"),

	init: function(app) {
		for (var name in this)
			if (name != "init")
				this[name].call(this, app);
	}
};