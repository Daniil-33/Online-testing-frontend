<template>
	<v-card class="px-5 py-5 h-100">
		<div class="w-100 d-flex">
			<v-spacer />

			<ui-buttons-group-toggler
				v-model="viewType"
				:items="viewTypes"
			/>
		</div>

		<v-window v-model="viewType">
			<v-window-item
				v-for="item in viewTypes"
				:key="item.value"
				:value="item.value"
			>
				<div class="h-100">
					<component :is="item.component" :form="form" />
				</div>
			</v-window-item>
		</v-window>
	</v-card>
</template>
<script>
import FormSubmissionsTable from './form-submissions/FormSubmissionsTable.vue';
import FormSubmissionsDashboard from './form-submissions/FormSubmissionsDashboard.vue';

import { ref, computed } from 'vue';

export default {
	name: 'FormSubmissions',
	components: {
		FormSubmissionsTable,
		FormSubmissionsDashboard
	},
	props: {
		form: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		const viewType = ref('table');
		const viewTypes = [
			{
				title: 'Таблиця',
				value: 'table',
				component: FormSubmissionsTable
			},
			{
				title: 'Дашборд',
				value: 'dashboard',
				component: FormSubmissionsDashboard
			},
		];

		const selectedViewType = computed(() => viewTypes.find(item => item.value === viewType.value));

		return {
			viewType,
			viewTypes,
			selectedViewType,
		}
	}
};
</script>
<style lang="scss">
.submission-review-area {
	background-color: rgba(235, 235, 235, 1);
	padding: 10px;
	border-radius: 4px;

	& .submission-display__questions-wrapper {
		height: calc(100vh - 207px);
	}
}
</style>