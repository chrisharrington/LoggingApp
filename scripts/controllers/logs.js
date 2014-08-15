Logger.app.controller("logs", ["$scope", function($scope, logRepository) {
	$scope.logs = [];
	$scope.loading = true;
//
//		{
//			name: "Running",
//			measurements: [
//				{ name: "Duration", value: "20 minutes" },
//				{ name: "Distance", value: "2 km" }
//			],
//			tags: [
//				{ name: "Sunny" },
//				{ name: "With friends" }
//			],
//			pictures: [
//				"http://blog.zensorium.com/wp-content/uploads/2014/04/running-21.jpg",
//				"http://cdn.business2community.com/wp-content/uploads/2014/04/running1.jpg"
//			]
//		},
//		{
//			name: "Swimming",
//			measurements: [
//				{ name: "Duration", value: "40 minutes" },
//				{ name: "Laps", value: "10" }
//			],
//			tags: [],
//			location: {
//				url: "//maps.googleapis.com/maps/api/staticmap?key=AIzaSyAiDv6aOjWSHij6SFkpptsIYef6OEnb-xM&zoom=14&size=376x200&scale=2&markers=Cardel Place, Calgary"
//			}
//		}
//	];
}]);