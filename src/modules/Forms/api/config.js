export default {
	// Forms
	'getForm': {
		url: '/api/form/:id',
		method: 'GET'
	},
	'getFormsList': {
		url: '/api/form',
		method: 'GET'
	},
	'addForm': {
		url: '/api/form',
		method: 'POST'
	},
	'updateForm': {
		url: '/api/form/:id',
		method: 'PUT'
	},
	'postForm': {
		url: '/api/form/:id',
		method: 'POST'
	},
	'deleteForm': {
		url: '/api/form/:id',
		method: 'DELETE'
	},

	// Submissions
	'getSubmission': {
		url: '/api/submission/:id',
		method: 'GET'
	},
	'getSubmissionsList': {
		url: '/api/submission',
		method: 'GET'
	},
	'updateSubmissionPoints': {
		url: '/api/submission/:id/update-points',
	},
	'deleteSubmission': {
		url: '/api/submission/:id',
		method: 'DELETE'
	},
}