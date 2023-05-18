import ApiService from '../api/';
import { ref, reactive, computed, watch } from 'vue';

export default function useForm() {
	const formsList = ref([])
	const form = ref(null)
	const formSubmissionConfig = ref(null)
	const loadingFlags = reactive({
		getForm: false,
		addForm: false,
		updateForm: false,
		deleteForm: false,
		postForm: false
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
				})
				.finally(() => loadingFlags.getForm = false)
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
				.catch((error) => rej(error))
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
				.catch((error) => rej(error))
				.finally(() => loadingFlags.updateForm = false)
		})
	}

	const deleteForm = async (id) => {}

	const postForm = (id, answers) => {
		return new Promise((res, rej) => {
			loadingFlags.postForm = true

			ApiService.request('postForm', {
				params: { id },
				data: { answers }
			})
				.then(({ success, confirmText }) => res(confirmText))
				.catch((error) => rej(error))
				.finally(() => loadingFlags.postForm = false)
		})
	}

	return {
		formsList,
		form,
		formSubmissionConfig,
		loadingFlags,

		getForm,
		getFormsList,
		getFormForSubmission,
		addForm,
		updateForm,
		deleteForm,
		postForm,
	}
}