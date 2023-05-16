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
									<v-checkbox
										class="answer-checkbox"
										label=""
										color="primary"
										:value="col.id"
										:model-value="modelValue[row.id]"
										:disabled="isViewingAnswer"
										@click="setRowValue(row.id, col.id)"
									></v-checkbox>
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
import { onBeforeMount } from 'vue'

export default {
	name: 'MultipleOptionsGridAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
		},
		rows: {},
		cols: {},
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
		const touchedByValidator = ref(false)
		const requireError = computed(() => {
			return touchedByValidator.value && !isAnswerFilled.value
		})

		const isAnswerFilled = computed(() => {
			return Object.values(props.modelValue).some((value) => value.length > 0)
		})

		const isAnswered = () => {
			touchedByValidator.value = true
			return isAnswerFilled.value
		}

		const makeModelValueEmptyStructure = () => {
			return Object.fromEntries(props.rows.map((row) => [row.id, []]))
		}

		const setRowValue = (rowId, colId) => {
			const currentRowValue = props.modelValue[rowId]

			const modelValue = {
				...props.modelValue,
				[rowId]: currentRowValue.includes(colId)
					? currentRowValue.filter((id) => id !== colId)
					: [...currentRowValue, colId],
			}

			updateModelValue(modelValue)
		}

		const updateModelValue = (value) => {
			emit('update:modelValue', value)
		}

		onBeforeMount(() => {
			updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setRowValue,
			isAnswered,
		}
	},
}
</script>