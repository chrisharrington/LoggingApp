Logger.app.service("imageLoader", function($q) {
	return {
		load: function(urls) {
			var deferred = $q.defer();
			var count = urls.length;
			for (var i = 0; i < urls.length; i++)
				$("body").append($("<img />", { style: "display: none !important", src: urls[i] }).on("load", function () {
					count--;
					if (count == 0)
						deferred.resolve();
				}));
			return deferred.promise;
		}
	}
});