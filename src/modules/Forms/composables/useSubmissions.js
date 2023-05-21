import ApiService from '../api/';
import { ref, reactive } from 'vue'

export default function useSubmissions () {
	const submissionsList = ref([])
	const submission = ref(null)
	const loadingFlags = reactive({
		getSubmission: false,
		deleteSubmission: false,
		updateSubmissionPoints: false
	})

	const getSubmissions = async () => {
		return new Promise((res, rej) => {
			loadingFlags.getSubmission = true

			ApiService.request('getSubmissionsList', {})
				.then(({ success, submissions }) => {
					submissionsList.value = submissions
					res(submissions)
				})
				.catch((error) => {
					rej(error)
				})
				.finally(() => {
					loadingFlags.getSubmission = false
				})
		})
	}

	const getSubmission = async (submissionId) => {
		return new Promise((res, rej) => {
			loadingFlags.getSubmission = true

			ApiService.request('getSubmission', {
				params: { id: submissionId }
			})
				.then(({ success, submission }) => {
					submission.value = submission
					res(submission)
				})
				.catch((error) => {
					rej(error)
				})
				.finally(() => {
					loadingFlags.getSubmission = false
				})
		})
	}

	return {
		submission,
		submissionsList,
		loadingFlags,

		getSubmissions,
		getSubmission
	}
}