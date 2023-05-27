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
			:class="(settingPoints || showPointsAndAnswers) ? `px-1 py-1 bg-${pointsData === 0 ? 'red-lighten-4' : 'green-lighten-4'}` : ''"
		>
			<v-textarea
				label="Detailed answer"
				variant="underlined"
				hide-details
				:color="(settingPoints || showPointsAndAnswers) ? (pointsData === 0 ? 'red' : 'green') : 'primary'"
				:error="pointsData === 0 && (settingPoints || showPointsAndAnswers)"
				:model-value="modelValue"
				:readonly="isViewingAnswer"
				@update:model-value="setValue"
			/>
		</div>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'DetailedTextAnswerRenderer',
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
	},
	emits: {
		'update:model-value': null,
		'update:answer-points': null,
	},
	expose: [ 'isAnswered' ],
	setup(props, { emit }) {
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
			updateAnswerPoints,
		}
	}
}
</script>