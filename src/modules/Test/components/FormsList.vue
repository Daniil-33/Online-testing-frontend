<template>
	<div>
		<FormsListController
			:list-mode="selectedListMode"
			@update:list-mode="selectedListMode = $event"
		/>

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
				<template v-if="selectedListMode === 'list'">
					<FormsColumnList
						v-slot="{ item }"
						:items="formsList"
					>
						<FormRowCard
							:form="item"
						/>
					</FormsColumnList>
				</template>

				<template v-else-if="selectedListMode === 'tile'">
					<FormsTileList
						v-slot="{ item }"
						:items="formsList"
					>
						<FormTileCard
							:form="item"
						/>
					</FormsTileList>
				</template>
			</template>
		</v-card>
	</div>
</template>
<script>
import FormsColumnList from './forms-list/FormsColumnList.vue';
import FormsTileList from './forms-list/FormsTileList.vue';
import FormRowCard from './forms-list/FormRowCard.vue';
import FormTileCard from './forms-list/FormTileCard.vue';
import FormsListController from './forms-list/FormsListController.vue';

import useForm from '../composables/useForm';
import { ref, computed } from 'vue'

export default {
	name: 'FormsListView',
	components: {
		FormsColumnList,
		FormsTileList,
		FormRowCard,
		FormTileCard,
		FormsListController,
	},
	setup() {
		const selectedListMode = ref(null)

		const {
			getFormsList,
			formsList,
			loadingFlags
		} = useForm()

		const isLoading = computed(() => loadingFlags.getForm)

		getFormsList()


		return {
			selectedListMode,
			formsList,
			isLoading
		}
	}
}
</script>