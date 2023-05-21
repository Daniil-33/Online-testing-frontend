<template>
	<div class="forms-list">
		<v-card class="px-3 py-3">
			<div class="w-100 d-flex align-items-center justify-space-between">
				<v-btn color="primary" size="small">New Form</v-btn>
			</div>
		</v-card>

		<v-card class="px-5 py-5 mt-3 forms-list__items-wrapper">
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
					class="forms-list__items"
				>
					<FormsListItem
						v-for="form in formsList"
						:key="form.id"
						:form="form"
					/>
				</div>

				<div v-else>
					<div class="w-100 px-3 py-3 d-flex justify-center">
						No forms yet
					</div>
				</div>
			</template>
		</v-card>
	</div>
</template>
<script>
import FormsListItem from './forms-list/FormsListItem.vue';

import useForm from '../composables/useForm';
import { ref, computed } from 'vue'

export default {
	name: 'FormsListView',
	components: {
		FormsListItem
	},
	setup() {
		const {
			getFormsList,
			formsList,
			loadingFlags
		} = useForm()

		const isLoading = computed(() => loadingFlags.getForm)
		const isEmptyList = computed(() => {
			return formsList.value.length === 0
		})

		getFormsList()

		return {
			isEmptyList,
			formsList,
			isLoading
		}
	}
}
</script>
<style scoped lang="scss">
.forms-list {
	&__items {
		&-wrapper {
			height: calc(100vh - 89px);
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