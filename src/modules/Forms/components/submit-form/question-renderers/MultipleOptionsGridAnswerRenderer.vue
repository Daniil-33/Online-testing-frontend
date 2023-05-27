<template>
	<div class="w-100">
		<slot name="heading"></slot>
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
							<th v-if="settingPoints || showPointsAndAnswers">
								<div class="td-inner px-2">
									Оценка
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
											class="answer-checkbox rounded"
											label=""
											:class="(settingPoints || showPointsAndAnswers) ? (rightAnswersData[row.id][col.id].highlight ? `bg-${rightAnswersData[row.id][col.id].highlight}` : '') : ''"
											:color="(settingPoints || showPointsAndAnswers) ? rightAnswersData[row.id][col.id].color : 'primary'"
											:value="col.id"
											:model-value="modelValue[row.id]"
											:readonly="isViewingAnswer"
											@click="setRowValue(row.id, col.id)"
										></v-checkbox>
									</div>
								</td>

								<td v-if="settingPoints || showPointsAndAnswers">
									<div class="td-inner py-1 px-1 td-content">
										<div class="d-flex align-center">
											<template v-if="settingPoints">
												<ui-number-field
													style="max-width: 40px;"
													:model-value="pointsData[row.id]"
													@update:model-value="updateAnswerPoints(row.id, $event)"
												/>

												<p class="pl-2">/ {{ maxPointsData[row.id] || 0 }}</p>
											</template>

											<template v-else-if="showPointsAndAnswers">
												<p class="pl-2">
													<span :class="{ 'text-orange': pointsData[row.id] > maxPointsData[row.id] }">{{ pointsData[row.id] }}</span>
													/ {{ maxPointsData[row.id] }}
												</p>
											</template>
										</div>
									</div>
								</td>
							</tr>
							<tr class="tr-placeholder">
								<td><div class="placeholder"></div></td>
								<td v-for="col in cols"><div class="placeholder"></div></td>
								<td v-if="settingPoints || showPointsAndAnswers"><div class="placeholder"></div></td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'MultipleOptionsGridAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
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
		showPointsAndAnswers: {
			type: Boolean,
			default: () => false
		},
		isCorrectAnswer: {
			type: Boolean,
			default: () => false
		},
		settingPoints: {
			type: Boolean,
			default: false
		},
		pointsData: {
			type: Object,
			default: () => ({})
		},
		maxPointsData: {
			type: Object,
			default: () => ({})
		},
		correctAnswersData: {
			type: [Array, Object],
			default: () => ([])
		},
	},
	emits: {
		'update:model-value': null,
	},
	expose: [ 'isAnswered' ],
	setup(props, { emit }) {
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
			emit('update:model-value', value)
		}

		const updateAnswerPoints = (rowId, value) => {
			emit('update:answer-points', {
				...props.pointsData,
				[rowId]: value
			})
		}

		const rightAnswersData = computed(() => {
			return Object.fromEntries(props.rows.map(({ id: rowId }) => {
				const rowData = Object.fromEntries(props.cols.map(({ id: colId }) => {
					const isOptionSelected = props.modelValue[rowId].includes(colId)
					const isOptionCorrect = props.correctAnswersData[rowId].includes(colId)

					const colData = {
						color: isOptionSelected
							? isOptionCorrect
								? 'success'
								: 'error'
							: isOptionCorrect ? 'success' : 'primary',
						highlight: isOptionSelected
							? (isOptionCorrect ? 'green-lighten-4' : 'red-lighten-4')
							: (isOptionCorrect ? 'green-lighten-4' : ''),
					}

					return [colId, colData]
				}))

				return [rowId, rowData]
			}))
		})

		onBeforeMount(() => {
			!props.isViewingAnswer && updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setRowValue,
			updateAnswerPoints,
			rightAnswersData,
		}
	},
}
</script>