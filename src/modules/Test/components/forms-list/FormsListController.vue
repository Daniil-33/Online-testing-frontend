<template>
	<v-card class="px-3 py-3">
		<div class="w-100 d-flex align-items-center justify-space-between">
			<v-btn color="primary" size="small">New Form</v-btn>

			<div class="d-flex align-items-center">
				<v-radio-btn-group
					:model-value="listMode"
					:options="listModeOptions"
					@update:model-value="onUpdateListMode"
				>
					<template v-slot:option-content="{ option }">
						<v-icon :icon="option.icon"></v-icon>
					</template>
				</v-radio-btn-group>
			</div>
		</div>
	</v-card>
</template>
<script>
import VRadioBtnGroup from '@/modules/Shared/components/UI/VRadioBtnGroup.vue';

import { ref } from 'vue';

export default {
	name: 'FormsListController',
	components: {
		'v-radio-btn-group': VRadioBtnGroup
	},
	props: {
		listMode: {
			type: String,
			default: 'list'
		},
		sorting: {
			type: Object,
			default: () => {
				return {
					field: 'id',
					order: 'desc'
				}
			}
		},
	},
	emits: {
		'update:list-mode': null,
		'update:sorting': null
	},
	setup(props, { emit }) {
		const listModeOptions = [
			{
				label: 'List',
				value: 'list',
				icon: 'mdi-format-list-bulleted'
			},
			{
				label: 'Tile',
				value: 'tile',
				icon: 'mdi-grid'
			}
		]

		const onUpdateListMode = (listMode) => {
			emit('update:list-mode', listMode);
		}

		onUpdateListMode(listModeOptions[0].value)

		return {
			listModeOptions,
			onUpdateListMode,
		}
	}
}
</script>
<style scoped lang="scss">
</style>