import ApiService from '../../api/';
import { ref, reactive } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore';
import { parseError } from '@/helpers/request-error-parser';

export default function useSubmissions () {
	const { addErrorNotify } = useApplicationStore()

	const submissionsList = ref([])
	const submission = ref(null)
	const loadingFlags = reactive({
		getSubmissions: false,
		getSubmission: false,
		deleteSubmission: false,
		updateSubmissionPoints: false
	})

	const getSubmissions = async () => {
		return new Promise((res, rej) => {
			loadingFlags.getSubmissions = true

			ApiService.request('getSubmissionsList', {})
				.then(({ success, submissions }) => {
					submissionsList.value = submissions
					res(submissions)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => {
					loadingFlags.getSubmissions = false
				})
		})
	}

	const getSubmission = async (submissionId) => {
		return new Promise((res, rej) => {
			loadingFlags.getSubmission = true

			ApiService.request('getSubmission', {
				params: { id: submissionId }
			})
				.then(({ success, submission: submissionData }) => {
					submission.value = submissionData
					res(submission)
				})
				.catch((error) => {
					rej(error)
					addErrorNotify({
						text: parseError(error.response.data || {}),
					})
				})
				.finally(() => {
					loadingFlags.getSubmission = false
				})
		})
	}

	const deleteSubmission = async (submissionId) => {
		return new Promise((res, rej) => {
			loadingFlags.deleteSubmission = true

			ApiService.request('deleteSubmission', {
				params: { id: submissionId }
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
				.finally(() => {
					loadingFlags.deleteSubmission = false
				})
		})
	}

	const updateSubmissionPoints = async (submissionId, pointsData) => {
		return new Promise((res, rej) => {
			loadingFlags.updateSubmissionPoints = true

			ApiService.request('updateSubmissionPoints', {
				params: { id: submissionId },
				data: { pointsData }
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
				.finally(() => {
					loadingFlags.updateSubmissionPoints = false
				})
		})
	}

	return {
		submission,
		submissionsList,
		loadingFlags,

		getSubmissions,
		getSubmission,
		updateSubmissionPoints,
		deleteSubmission,
	}
}