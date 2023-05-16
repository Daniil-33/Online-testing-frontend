import { createRouter, createWebHistory } from 'vue-router'

// === FORM VIEWS START === //

import {
	FormsView,
	NewFormView,
	EditFormView,
	FormSubmitView,
	FormsListView,
	SubmissionsListView,
} from '@/modules/Test/'

// const formRoutes = [
// 	{
// 		path: '/forms',
// 		name: 'Forms',
// 		component: FormsView,
// 	},
// 	{
// 		path: '/new-form',
// 		name: 'New Form',
// 		component: NewFormView,
// 	},
// 	{
// 		path: '/edit-form/:formId',
// 		name: 'Edit Form',
// 		component: EditFormView
// 	},
// 	{
// 		path: '/submit',
// 		name: 'SubmitForm',
// 		component: FormSubmitView
// 	}
// ]
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
				name: 'SubmitForm',
				component: FormSubmitView
			},
			{
				path: 'submissions',
				name: 'Submissions List',
				component: SubmissionsListView,
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
