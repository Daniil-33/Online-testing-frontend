import ApiService from '../api/';
import { ref, reactive, computed, watch } from 'vue';
import { useApplicationStore } from '@/stores/applicationStore';
import { parseError } from '@/helpers/request-error-parser';

export default function useForm() {
	const { addErrorNotify } = useApplicationStore()

	const formsList = ref([])
	const formSubmissionsList = ref([])
	const form = ref(null)
	const formSubmissionConfig = ref(null)
	const formSubmissionsAnalytic = ref(null)
	const loadingFlags = reactive({
		getForm: false,
		addForm: false,
		updateForm: false,
		deleteForm: false,
		postForm: false,
		getSubmissions: false,
		deleteSubmission: false,
		getFormSubmissionsAnalytic: false
	})

	const getForm = async (id) => {
		return new Promise((res, rej) => {
			loadingFlags.getForm = true

			ApiService.request('getForm', {
				params:{ id }
			})
				.then(({ success, form: formData }) => {
					form.value = formData
					res(form)
				})
				.catch((error) => {
					rej(error)

					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.getForm = false)
		})
	}

	const getFormsList = async () => {
		return new Promise((res, rej) => {
			loadingFlags.getForm = true

			ApiService.request('getFormsList', {})
				.then(({ success, forms }) => {
					formsList.value = forms
					res(forms)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => {
					loadingFlags.getForm = false
				})
		})
	}

	const getFormForSubmission = async (id) => {
		return new Promise((res, rej) => {
			loadingFlags.getForm = true

			ApiService.request('getForm', {
				params:{ id },
				queryParams: { format: 'submission' }
			})
				.then(({ success, form: formData }) => {
					formSubmissionConfig.value = formData
					res(form)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.getForm = false)
		})
	}

	const getFormSubmissionsAnalytic = async (id) => {
		return new Promise((res, rej) => {
			loadingFlags.getFormSubmissionsAnalytic = true

			ApiService.request('getFormSubmissionsAnalytic', {
				params:{ id }
			})
				.then(({ success, analytic }) => {
					formSubmissionsAnalytic.value = analytic
					res(analytic)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.getFormSubmissionsAnalytic = false)
		})
	}

	const getFormSubmissions = async (id) => {
		return new Promise((res, rej) => {
			loadingFlags.getSubmissions = true

			ApiService.request('getFormSubmissions', {
				params:{ id }
			})
				.then(({ success, submissions }) => {
					formSubmissionsList.value = submissions
					res(submissions)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.getSubmissions = false)
		})
	}

	const deleteFormSubmission = async (formId, submissionId) => {
		return new Promise((res, rej) => {
			loadingFlags.deleteSubmission = true

			ApiService.request('deleteFormSubmission', {
				params: {
					id: formId,
					submissionId
				}
			})
				.then(({ success, formId }) => {
					form.value = formId

					res(formId)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.deleteSubmission = false)
		})
	}

	const addForm = async (data) => {
		return new Promise((res, rej) => {
			loadingFlags.addForm = true

			ApiService.request('addForm', { data })
				.then(({ success, formId }) => {
					form.value = formId

					res(formId)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.addForm = false)
		})
	}

	const updateForm = async ({ id, data }) => {
		return new Promise((res, rej) => {
			loadingFlags.updateForm = true

			ApiService.request('updateForm', {
				params: { id },
				data
			})
				.then(({ success, formId }) => {
					form.value = formId

					res(formId)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.updateForm = false)
		})
	}

	const deleteForm = async (id) => {
		return new Promise((res, rej) => {
			loadingFlags.deleteForm = true

			ApiService.request('deleteForm', {
				params: { id }
			})
				.then(({ success }) => {
					res(success)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.deleteForm = false)
		})
	}

	const postForm = (id, answers) => {
		return new Promise((res, rej) => {
			loadingFlags.postForm = true

			ApiService.request('postForm', {
				params: { id },
				data: { answers }
			})
				.then(({ success, confirmText }) => res(confirmText))
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => loadingFlags.postForm = false)
		})
	}

	return {
		formsList,
		form,
		formSubmissionConfig,
		formSubmissionsAnalytic,
		formSubmissionsList,
		loadingFlags,

		getForm,
		getFormsList,
		getFormForSubmission,
		getFormSubmissions,
		deleteFormSubmission,
		getFormSubmissionsAnalytic,
		addForm,
		updateForm,
		deleteForm,
		postForm,
	}
}