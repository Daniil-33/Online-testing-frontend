<template>
	<div class="submissions-list">
		<v-card class="px-5 py-5 submissions-list__items-wrapper">
			<template v-if="isLoading">
				<div class="h-100 w-100 px-3 py-3 d-flex justify-center align-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>
			<template v-else>
				<div
					v-if="!isEmptyList"
					class="submissions-list__items"
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
import SubmissionsListItem from './submissions-list/SubmissionListItem.vue';

import { computed } from 'vue'
import useSubmissions from '../composables/useSubmissions'

export default {
	name: 'SubmissionsList',
	components: {
		SubmissionsListItem,
	},
	setup(props) {
		const {
			getSubmissions,
			submissionsList,
			loadingFlags
		} = useSubmissions()

		const isLoading = computed(() => loadingFlags.getSubmission)
		const isEmptyList = computed(() => {
			return submissionsList.value.length === 0
		})

		getSubmissions()

		return {
			isEmptyList,
			isLoading,
			submissionsList
		}
	},
}
</script>
<style scoped lang="scss">
.submissions-list {
	&__items {
		&-wrapper {
			height: calc(100vh - 25px);
			overflow-y: auto;
		}

		display: flex;
		flex-direction: column;

		& > *:not(:first-child) {
			margin-top: 12px;
		}
	}
}
</style>