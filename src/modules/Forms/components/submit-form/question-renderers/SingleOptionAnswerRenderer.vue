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
		<v-radio-group
			:model-value="modelValue.selected"
			@update:model-value="setValue"
		>
			<template
				v-for="option in options"
				:key="option.id"
			>
				<template v-if="option.isCustomAnswer">
					<div
						class="d-flex align-center rounded"
						:class="(showPointsAndAnswers || settingPoints) ? (rightAnswersData[option.id].highlight ? `pr-1 bg-${rightAnswersData[option.id].highlight}` : '') : ''"
					>
						<v-radio
							inline
							:color="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].color : 'primary'"
							:readonly="isViewingAnswer"
							:value="option.id"
							:label="option.text"
						></v-radio>
						<v-text-field
							label=""
							hide-details
							variant="underlined"
							color="primary"
							style="margin-top: -20px"
							:readonly="isViewingAnswer"
							:model-value="modelValue.customAnswerText"
							@update:model-value="setCustomAnswerText($event)"
						></v-text-field>
					</div>
				</template>
				<template v-else>
					<v-radio
						class="rounded"
						:class="(showPointsAndAnswers || settingPoints) ?( rightAnswersData[option.id].highlight ? `bg-${rightAnswersData[option.id].highlight}` : '') : ''"
						:color="(showPointsAndAnswers || settingPoints) ? rightAnswersData[option.id].color : 'primary'"
						:readonly="isViewingAnswer"
						:value="option.id"
						:label="option.text"
					></v-radio>
				</template>
			</template>
		</v-radio-group>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'SingleOptionAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
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
				selected: '',
				customAnswerText: '',
			}
		}

		const setValue = (optionId) => {
			updateModelValue({
				...props.modelValue,
				selected: optionId,
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
			return props.isViewingAnswer && Object.fromEntries(props.options.map((option) => {
				const isThisOptionCorrect = props.correctAnswersData.includes(option.id)
				const isThisOptionSelected = props.modelValue.selected.includes(option.id)

				const data = {
					color: isThisOptionSelected
						? isThisOptionCorrect
							? 'success'
							: 'error'
						: isThisOptionCorrect ? 'success' : 'primary',
					highlight: isThisOptionSelected ? (isThisOptionCorrect ? 'green-lighten-4' : 'red-lighten-4') : '',
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