var Promise = require("bluebird");

var mongoose = require("mongoose");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var caches = require("../data/caches");
var bundler = require("../bundling/bundler");
var config = require("../config");
var mustache = require("mustache");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/", function (request, response) {
		return Promise.all([
			fs.readFileAsync("public/views/root.html"),
			require("../bundling/scriptBundler").render(require("../bundling/assets").scripts(), app)
		]).spread(function(html, scripts) {
			response.send(mustache.render(html.toString(), {
				renderedScripts: scripts,
				styleLocation: "/style"
			}), 200);
		});
	});
};