var config = {url: 'json/data.json'};
var app = angular.module('Profile_App', []);
app.controller('Profile_Controller', function($scope, $http) {
	$http.get(config.url).success(function (response) {
		$scope.data = response;
	});
});