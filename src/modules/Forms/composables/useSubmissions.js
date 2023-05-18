import ApiService from '../api/';
import { ref } from 'vue'

export default function useSubmissions () {
	const submissions = ref([])
	const submission = ref(null)
	const loadingFlags = ref({
		getSubmissions: false,
		getSubmission: false
	})

	const getSubmissions = async () => {}

	const getSubmission = async (submissionId) => {}

	return {
		getSubmissions,
		getSubmission
	}
}