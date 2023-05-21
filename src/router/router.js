import { createRouter, createWebHistory } from 'vue-router'

// === FORM VIEWS START === //

import {
	FormsView,
	NewFormView,
	EditFormView,
	FormSubmitView,
	FormsListView,
	SubmissionsListView,
	SubmissionReviewView,
} from '@/modules/Forms/'


const formRoutes = [
	{
		path: '/',
		redirect: '/forms'
	},
	{
		path: '/forms',
		name: 'Forms',
		component: FormsView,
		children: [
			{
				path: '',
				name: 'Forms List',
				component: FormsListView,
			},
			{
				path: 'new',
				name: 'New Form',
				component: NewFormView,
			},
			{
				path: 'edit/:id',
				name: 'Edit Form',
				component: EditFormView
			},
			{
				path: 'submit/:id',
				name: 'Submit Form',
				component: FormSubmitView
			},
			{
				path: 'submissions',
				name: 'Submissions List',
				component: SubmissionsListView,
			},
			{
				path: 'submissions/:id',
				name: 'Submission Review',
				component: SubmissionReviewView,
			}
		]
	},
]

// === FORM VIEWS END === //

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		...formRoutes
	],
})

export default router
