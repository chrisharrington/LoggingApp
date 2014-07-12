var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

describe("string extensions", function() {
	describe("formatForUrl", function() {
		it("should return a lower case string", function() {
			var sample = "EXTERMINATE";
			assert(sample.formatForUrl() == sample.toLowerCase());
		});

		it("should replace non-letter characters with an empty string", function() {
			assert("!@#$%^&*()_+={}|[]\\;:'\"/?.>,<)".formatForUrl() == "");
		});

		it("should leave numbers alone", function() {
			assert("1.2.3.4.5".formatForUrl() == "12345");
		});

		it("should leave letters alone", function() {
			assert("a/B/c/D/e/F".formatForUrl() == "abcdef");
		});

		it("should replace spaces with hyphens (-)", function() {
			assert("1 2 a b A B".formatForUrl() == "1-2-a-b-a-b");
		});
	});

	describe("endsWith", function() {
		it("should return true for 'boogity'.endsWith('ity')", function() {
			assert("boogity".endsWith("ity"));
		});

		it("should return false with case insensitive check", function() {
			assert("boogity".endsWith("ITY") == false);
		});

		it("should return false with missing value", function() {
			assert("boogity".endsWith() == false);
		});

		it("should return false if value length is greater than string length", function() {
			assert("b".endsWith("ahhhh") == false);
		});
	});
});