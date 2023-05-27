<template>
	<SubmissionReview
		:submissionId="submissionId"
	/>
</template>
<script>
import SubmissionReview from '../components/SubmissionReview.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
	name: 'SubmissionReviewView',
	components: {
		SubmissionReview
	},
	setup() {
		const route = useRoute();
		const submissionId = computed(() => {
			return route.params.id;
		});

		return {
			submissionId
		}
	}
}
</script>