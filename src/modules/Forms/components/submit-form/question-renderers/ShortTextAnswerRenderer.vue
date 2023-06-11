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

		<div
			class="w-100 rounded"
			:class="(settingPoints || showPointsAndAnswers) ? `px-1 py-1 bg-${isCorrectAnswer ? 'green-lighten-4' : 'red-lighten-4'}` : ''"
		>
			<v-text-field
				class="rounded"
				label="Коротка відповідь"
				variant="underlined"
				hide-details
				:color="(settingPoints || showPointsAndAnswers) ? (isCorrectAnswer ? 'green' : 'red') : 'primary'"
				:readonly="isViewingAnswer"
				:model-value="modelValue"
				@update:model-value="setValue"
			></v-text-field>

			<div
				v-if="settingPoints || showPointsAndAnswers"
				class="pt-2 text-green"
			>
				{{ correctAnswers }}
			</div>
		</div>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'ShortTextAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
		},
		isViewingAnswer: {
			type: Boolean,
			default: () => false
		},
		showPointsAndAnswers: {
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
		const isAnswerFilled = computed(() => {
			return props.modelValue !== ''
		})

		const correctAnswers = computed(() => (props.correctAnswersData || []).join(', '))
		const isCorrectAnswer = computed(() => {
			return props.correctAnswersData.map(text => text.trim().toLowerCase()).includes((props.modelValue || '').trim().toLowerCase())
		})

		const isAnswered = () => {
			touchedByValidator.value = true
			return isAnswerFilled.value
		}

		const makeModelValueEmptyStructure = () => {
			return ''
		}

		const setValue = (text) => {
			updateModelValue(text)
		}

		const updateModelValue = (value) => {
			emit('update:model-value', value)
		}

		const updateAnswerPoints = (value) => {
			emit('update:answer-points', value)
		}

		onBeforeMount(() => {
			!props.isViewingAnswer && updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setValue,
			isAnswered,
			updateAnswerPoints,
			correctAnswers,
			isCorrectAnswer,
		}
	}
}
</script>