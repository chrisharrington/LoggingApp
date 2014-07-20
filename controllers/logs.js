var Promise = require("bluebird");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/logs", function (request, response) {
		return base.view("public/views/logs.html", response);
	});

	app.get("/new-log", function(request, response) {
		return base.view("public/views/newLog.html", response);
	});

	app.get("/new-measurement", function(request, response) {
		return base.view("public/views/newMeasurement.html", response);
	})
};