
app.factory('Branches', function($resource) {
	return $resource('/rest/entrypoint/branches', {});
})

.factory('EntryPoints', function($resource) {
	return $resource('/rest/entrypoint/branches/:branchId/entryPoints/deviceTypes/SW_RECEPTION', {});
})

.factory('User', function($resource) {
	return $resource('/rest/entrypoint/user', {});
})

.factory('Services', function($resource) {
	return $resource('/rest/entrypoint/branches/:branchId/services', {});
})

.factory('Queues', function($resource) {
	return $resource('/rest/entrypoint/branches/:branchId/queues', {});
})

.factory('Visits', function($resource) {
	return $resource('/rest/entrypoint/branches/:branchId/queues/:queueId/visits', {});
})

.factory('Visit', function($resource) {
	return $resource('/rest/entrypoint/branches/:branchId/entryPoints/:entryPointId/visits', {});
});