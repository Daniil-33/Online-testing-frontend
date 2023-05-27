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
	'getFormSubmissions': {
		url: '/api/form/:id/submissions',
		method: 'GET'
	},
	'deleteFormSubmission': {
		url: '/api/form/:id/submissions/:submissionId',
		method: 'DELETE'
	},
	'getFormSubmissionsAnalytic': {
		url: '/api/form/:id/submissions/analytic',
		method: 'GET'
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
		method: 'PUT'
	},
	'deleteSubmission': {
		url: '/api/submission/:id',
		method: 'DELETE'
	},
}