<template>
	<div class="w-100">
		<div class="d-flex align-center justify-space-between">
			<slot name="heading"></slot>

			<div class="d-flex align-center">
				<template v-if="settingPoints">
					<ui-number-field
						style="max-width: 40px;"
						:model-value="pointsData"
						@update:model-value="updateAnswerPoints"
					/>

					<p class="pl-2">/ {{ maxPointsData }}</p>
				</template>

				<template v-else-if="showPointsAndAnswers">
					<p class="pl-2">
						<span :class="{ 'text-orange': pointsData > maxPointsData }">{{ pointsData }}</span>
						 / {{ maxPointsData }}
					</p>
				</template>
			</div>
		</div>
		<div class="w-100 d-flex flex-column">
			<template
				v-for="option in options"
				:key="option.id"
			>
				<template v-if="option.isCustomAnswer">
					<div
						class="d-flex align-center rounded pr-1"
						:class="(showPointsAndAnswers || settingPoints) ? (rightAnswersData[option.id].highlight ? `bg-${rightAnswersData[option.id].highlight}` : '') : ''"
					>
						<v-checkbox-btn
							class="pr-1"
							:color="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].color : 'primary'"
							:readonly="isViewingAnswer"
							:label="option.text"
							:value="option.id"
							:model-value="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].checked : modelValue.selected"
							@update:model-value="setValue(option.id)"
						></v-checkbox-btn>

						<v-text-field
							label=""
							variant="underlined"
							color="primary"
							hide-details
							style="margin-top: -20px"
							:readonly="isViewingAnswer"
							:model-value="modelValue.customAnswerText"
							@update:model-value="setCustomAnswerText($event)"
						></v-text-field>
					</div>
				</template>
				<template v-else>
					<v-checkbox-btn
						class="pr-2 rounded"
						:class="(showPointsAndAnswers || settingPoints) ? (rightAnswersData[option.id].highlight ? `bg-${rightAnswersData[option.id].highlight}` : '') : ''"
						:color="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].color : 'primary'"
						:readonly="isViewingAnswer"
						:label="option.text"
						:value="option.id"
						:model-value="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].checked : modelValue.selected"
						@update:model-value="setValue(option.id)"
					></v-checkbox-btn>
				</template>
			</template>
		</div>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'MultipleOptionsAnswerRenderer',
	props: {
		modelValue: {
			type: Array,
			default: () => []
		},
		options: {
			type: Object,
			default: () => ({}),
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
			type: Number,
			default: 0
		},
		maxPointsData: {
			type: Number,
			default: 0
		},
		correctAnswersData: {
			type: [Array, Object],
			default: () => ([])
		},
	},
	emits: {
		'update:model-value': null,
		'update:answer-points': null,
	},
	expose: [ 'isAnswered' ],
	setup(props, { emit }) {
		const makeModelValueEmptyStructure = () => {
			return {
				selected: [],
				customAnswerText: '',
			}
		}

		const setValue = (optionId) => {
			const currentValue = props.modelValue.selected

			const newValue = currentValue.includes(optionId)
				? currentValue.filter((id) => id !== optionId)
				: [...currentValue, optionId]

			updateModelValue({
				...props.modelValue,
				selected: newValue,
			})
		}

		const updateModelValue = (value) => {
			emit('update:model-value', value)
		}

		const updateAnswerPoints = (value) => {
			emit('update:answer-points', value)
		}

		const setCustomAnswerText = (value) => {
			updateModelValue({
				...props.modelValue,
				customAnswerText: value,
			})
		}

		const rightAnswersData = computed(() => {
			return Object.fromEntries(props.options.map((option) => {
				const isThisOptionCorrect = props.correctAnswersData.includes(option.id)
				const isThisOptionSelected = props.modelValue.selected.includes(option.id)

				const data = {
					color: isThisOptionSelected
						? isThisOptionCorrect
							? 'success'
							: 'error'
						: isThisOptionCorrect ? 'success' : 'primary',
					checked: isThisOptionSelected ? [option.id] : [],
					highlight: isThisOptionSelected
						? (isThisOptionCorrect ? 'green-lighten-4' : 'red-lighten-4')
						: (isThisOptionCorrect ? 'green-lighten-4' : ''),
				}

				return [option.id, data]
			}))
		})

		onBeforeMount(() => {
			!props.isViewingAnswer && updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setValue,
			setCustomAnswerText,
			updateAnswerPoints,
			rightAnswersData,
		}
	}
}
</script>