<template>
	<div class="h-100">
		<div class="h-100">
			<template v-if="isLoading">
				<div class="h-100 w-100 px-3 py-3 d-flex justify-center align-center bg-white rounded">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>

			<template v-else-if="isLoadingCrashed">
				<div class="w-100 px-3 py-3 d-flex justify-center">
					<p class="text-h4 text-center">Щось пішло не так...</p>
				</div>
			</template>

			<template v-else>
				<SubmissionDisplay
					:submission="submission"
					:settingPoints="false"
					:renderWithPointsAndAnswers="renderWithPointsAndAnswers"
				/>
			</template>
		</div>
	</div>
</template>
<script>
import SubmissionDisplay from './submit-form/SubmissionDisplay.vue';
import useSubmissions from '../composables/useSubmissions';
import { safeAsyncCall } from '@/helpers/utilsHelper'
import { computed, ref } from 'vue';

export default {
	name: 'SubmissionReview',
	components: {
		SubmissionDisplay,
	},
	props: {
		submissionId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const {
			submission,
			loadingFlags,
			getSubmission,
		} = useSubmissions()

		const isLoadingCrashed = ref(false);
		const loadData = async () => {
			const [error, result] = await safeAsyncCall(getSubmission(props.submissionId));

			if(error) {
				isLoadingCrashed.value = true;
			}
		}

		const isLoading = computed(() => loadingFlags.getSubmission)
		const renderWithPointsAndAnswers = computed(() => {
			return (submission.value?.formData.settings.showResultsAfter === 'check' && submission.value.isChecked) || submission.value?.formData.settings.showResultsAfter === 'submit'
		})

		getSubmission(props.submissionId)

		return {
			isLoading,
			submission,
			renderWithPointsAndAnswers,
			isLoadingCrashed,
		}
	}
}
</script>