var app = angular.module('concierge', ['ui.router', 'ui.bootstrap', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');
	
	$stateProvider
	
	.state('/ep', {
		templateUrl : 'pages/entrypoint.html',
		controller : 'epController'
	});
	
});