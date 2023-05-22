<template>
	<div class="options-grid">
		<div class="table-container">
			<table style="width: 100%">
				<thead>
					<tr>
						<th></th>
						<th
							v-for="col in cols"
							:key="col.id"
						>
							<div class="td-inner px-2">
								<p>{{ col.text }}</p>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<template
						v-for="row in rows"
						:key="row.id"
					>
						<tr>
							<td>
								<div class="td-inner td-content py-1 px-1">
									{{ row.text }}
								</div>
							</td>

							<td
								v-for="col in cols"
								:key="col.id"
							>
								<div class="td-inner py-1 px-1 td-content">
									<v-radio
										label=""
										color="primary"
										:id="row.id"
										:value="col.id"
										:model-value="modelValue[row.id]"
										:readonly="isViewingAnswer"
										@click="setRowValue(row.id, col.id)"
									></v-radio>
								</div>
							</td>
						</tr>
						<tr class="tr-placeholder">
							<td><div class="placeholder"></div></td>
							<td v-for="col in cols"><div class="placeholder"></div></td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'SingleOptionGridAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ({})
		},
		rows: {
			type: Array,
			default: () => []
		},
		cols: {
			type: Array,
			default: () => []
		},
		isViewingAnswer: {
			type: Boolean,
			default: () => false
		},
		isRightAnswered: {
			type: Boolean,
			default: () => false
		},
	},
	emits: {
		'update:modelValue': null,
	},
	expose: [ 'isAnswered' ],
	setup(props, { emit }) {
		const makeModelValueEmptyStructure = () => {
			return Object.fromEntries(props.rows.map((row) => [row.id, null]))
		}

		const setRowValue = (rowId, colId) => {
			const newModelValue = {
				...props.modelValue,
				[rowId]: colId
			}

			updateModelValue(newModelValue)
		}

		const updateModelValue = (value) => {
			emit('update:modelValue', value)
		}

		onBeforeMount(() => {
			!props.isViewingAnswer && updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setRowValue,
		}
	},
}
</script>
<style>
.td-inner .v-selection-control {
	width: fit-content;
    max-width: fit-content;
}
</style>