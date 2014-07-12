var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var sut = require("../../controllers/controllers");

describe("controllers", function() {
	describe("init", function() {
		it("should initialize the correct number of controllers", function() {
			var count = 0;
			for (var name in sut)
				if (name != "init")
					count++;

			assert.equal(count, 1);
		});

		it("should initialize root controller", function() {
			_run("root");
		});

		function _run(controller) {
			var app = "the app";
			for (var name in sut)
				if (name != "init")
					sut[name] = sinon.stub();

			sut.init(app);

			assert(sut[controller].calledWith(app));
		}
	});
});