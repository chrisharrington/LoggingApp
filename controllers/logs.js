var Promise = require("bluebird");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/logs", function (request, response) {
		return base.view("public/views/logs.html", response);
	});
};