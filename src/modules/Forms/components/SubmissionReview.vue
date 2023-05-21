<template>
	<div class="submission-review">
		<v-card class="px-5 py-5 submission-review__items-wrapper">
			<template v-if="isLoading">
				<div class="h-100 w-100 px-3 py-3 d-flex justify-center align-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>
			<template v-else>
				submission loaded
			</template>
		</v-card>
	</div>
</template>
<script>
import useSubmissions from '../composables/useSubmissions';
import { computed } from 'vue';

export default {
	name: 'SubmissionReview',
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

		const isLoading = computed(() => loadingFlags.getSubmission)

		getSubmission(props.submissionId)

		return {
			isLoading
		}
	}
}
</script>
<style>
.submission-review {}
</style>