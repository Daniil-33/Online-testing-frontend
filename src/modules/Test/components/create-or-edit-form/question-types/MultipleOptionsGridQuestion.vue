<template>
	<v-row>
		<v-col cols="6">
			<p class="text-h6">Rows</p>
			<draggable
				itemKey="id"
				:list="rows"
				@update="updateOptions"
			>
				<template #item="{ element: option, index }">
					<div
						class="d-flex align-center"
						handle=".handle"
					>
						<v-icon class="handle mr-1" icon="mdi-drag-vertical" style="margin-right: -5px;"></v-icon>
						<span>
							{{ index + 1 }}.
						</span>
						<v-text-field
							v-model="option.text"
							variant="underlined"
							color="primary"
							:autofocus="true"
						></v-text-field>

						<v-icon
							v-if="rows.length !== 1"
							icon="mdi-close"
							@click="removeRow(index)"
						></v-icon>
						<div v-else class="close-placeholder"></div>
					</div>
				</template>
			</draggable>

			<v-btn
				variant="plain"
				@click="addRow"
			>
				Add row
			</v-btn>
		</v-col>
		<v-col cols="6">
			<p class="text-h6">Cols</p>
			<draggable
				itemKey="id"
				:list="cols"
				@update="updateOptions"
			>
				<template #item="{ element: option, index }">
					<div
						class="d-flex align-center"
						handle=".handle"
					>
						<v-icon class="handle" icon="mdi-drag-vertical" style="margin-right: -5px;"></v-icon>

						<v-checkbox-btn
							class="pr-2"
							:disabled="true"
						></v-checkbox-btn>

						<v-text-field
							v-model="option.text"
							variant="underlined"
							color="primary"
							:autofocus="true"
							@change="updateOptions"
						></v-text-field>

						<v-icon
							v-if="cols.length !== 1"
							icon="mdi-close"
							@click="removeCol(index)"
						></v-icon>
						<div v-else class="close-placeholder"></div>
					</div>
				</template>
			</draggable>

			<v-btn
				variant="plain"
				@click="addCol"
			>
				Add column
			</v-btn>
		</v-col>
	</v-row>
</template>
<script>
import { reactive, onMounted } from 'vue'

import draggable from "vuedraggable";

export default {
	name: 'MultipleOptionsGridQuestion',
	props: {
		content: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: {
		'update:content': null,
	},
	components: {
		draggable
	},
	setup(props, { emit }) {
		const rows = reactive([])
		const cols = reactive([])

		const updateOptions = () => {
			emit('update:content', {
				rows: [...rows],
				cols: [...cols],
			})
		}

		const addOption = (source) => {
			source.push({
				text: '',
				id: Math.floor(Math.random() * 100000).toString(),
			})

			updateOptions()
		}

		const removeOption = (source, index) => {
			source.splice(index, 1)

			updateOptions()
		}

		const addRow = () => addOption(rows)
		const addCol = () => addOption(cols)

		const removeRow = (index) => removeOption(rows, index)
		const removeCol = (index) => removeOption(cols, index)

		onMounted(() => {
			setTimeout(() => {
				if (props.content.rows?.length) {
					rows.push(...props.content.rows)
					updateOptions()
				} else {
					addRow()
				}

				if (props.content.cols?.length) {
					cols.push(...props.content.cols)
					updateOptions()
				} else {
					addCol()
				}
			}, 100)
		})

		return {
			rows,
			cols,
			addRow,
			addCol,
			removeRow,
			removeCol,

			updateOptions
		}
	}
}
</script>
<style>
.checkbox-pseudo {
	width: 10px;
	height: 10px;

	border: 1px solid #000;
}

.lose-placeholder {
	min-width: 21px;
}
</style>