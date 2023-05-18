<template>
	<div class="submission-list">
		<v-card class="px-5 py-5 mt-3">
			<template v-if="isLoading">
				<div class="w-100 px-3 py-3 d-flex justify-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>
			<template v-else>
				<div
					v-if="!isEmptyList"
					class="submission-list__items"
				>
					<SubmissionsListItem
						v-for="submission in submissionsList"
						:key="submission.id"
						:submission="submission"
					/>
				</div>
				<div v-else>
					<div class="w-100 px-3 py-3 d-flex justify-center">
						No submissions yet
					</div>
				</div>
			</template>
		</v-card>
	</div>
</template>

<script>
import SubmissionsListItem from './submissions-list/SubmissionsListItem.vue';
import { computed } from 'vue'
import useSubmissions from '../composables/useSubmissions'

export default {
	name: 'SubmissionsList',
	components: {
		SubmissionsListItem
	},
	setup(props) {
		const {
			getSubmissionsList,
			submissionsList,
			loadingFlags
		} = useSubmissions()

		const isEmptyList = computed(() => {
			return props.submissionsList.length === 0
		})
		const isLoading = computed(() => loadingFlags.getSubmissions)

		getSubmissionsList()

		return {
			isEmptyList,
			isLoading,
			submissionsList
		}
	},
}
</script>
<style scoped>

</style>