<template>
	<div class="submission-display__content-container">
		<div class="px-5 mb-2 bg-white rounded">
			<div class="d-flex align-center justify-space-between">
				<h3>{{ submission.formData.title }}</h3>

				<p
					v-if="submission.aggregatedPoints !== undefined"
					class="text-subtitle-1"
				>
					<span :class="{'text-orange': submission.aggregatedPoints > submission.formData.maxPoints }">{{ submission.aggregatedPoints }}</span>
					 / {{ submission.formData.maxPoints }}
				</p>
			</div>

			<p
				v-if="submission.formData.description"
				class="text-subtitle-1"
			>
				{{ submission.formData.description }}
			</p>
		</div>
	</div>
	<div class="submission-display__questions-wrapper">
		<div class="d-flex flex-column" style="max-width: 1000px; margin: 0 auto;">

			<div class="submission-display__questions">
				<template
					v-for="(question, index) in submission.questions"
					:key="question.id"
				>
					<div
						class="w-100 bg-white px-3 py-3 bg-white rounded question-card"
						:class="{ 'mt-2': index > 0 }"
					>
						<component
							v-bind="question.content"
							:is="questionTypesComponentReference[question.type]"
							:isViewingAnswer="true"
							:settingPoints="settingPoints"
							:showPointsAndAnswers="renderWithPointsAndAnswers"
							:pointsData="pointsData[question.id] || 0"
							:maxPointsData="maxPointsData[question.id]"
							:correctAnswersData="question.answerData && question.answerData.correctAnswersData || {}"
							:model-value="modelValues[question.id]"
							@update:answer-points="onUpdateAnswerPoints(question.id, $event)"
						>
							<template v-slot:heading>
								<p class="text-subtitle-1">
									{{ question.title }}

									<span
										v-if="question.isRequired || submission.formData.settings.isAllQuestionsRequired"
										class="text-red"
									>*</span>
								</p>
							</template>
						</component>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
import { ref, computed } from 'vue';

import {
	ShortTextAnswerRenderer,
	DetailedTextAnswerRenderer,

	SingleOptionAnswerRenderer,
	MultipleOptionsAnswerRenderer,

	SingleOptionGridAnswerRenderer,
	MultipleOptionsGridAnswerRenderer,
} from './question-renderers/'

import { questionTypesReference } from '../../composables/useFormManager'

const questionTypesComponentReference = {
	[questionTypesReference.SHORT_TEXT_ANSWER]: ShortTextAnswerRenderer,
	[questionTypesReference.DETAILED_TEXT_ANSWER]: DetailedTextAnswerRenderer,
	[questionTypesReference.SINGLE_OPTION]: SingleOptionAnswerRenderer,
	[questionTypesReference.MULTIPLE_OPTIONS]: MultipleOptionsAnswerRenderer,
	[questionTypesReference.SINGLE_OPTIONS_GRID]: SingleOptionGridAnswerRenderer,
	[questionTypesReference.MULTIPLE_OPTIONS_GRID]: MultipleOptionsGridAnswerRenderer,
}
export default {
	name: 'SubmissionDisplay',
	components: {},
	props: {
		submission: {
			type: Object,
			default: () => ({})
		},
		settingPoints: {
			type: Boolean,
			default: false
		},
		renderWithPointsAndAnswers: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:answer-points'],
	setup(props, { emit }) {
		const modelValues = ref(Object.fromEntries((props.submission.questions || []).map(question => {
			switch (question.type) {
				case questionTypesReference.SINGLE_OPTION:
				case questionTypesReference.MULTIPLE_OPTIONS:
					return [question.id, {
						selected: question.answerData.answer,
						customAnswerText: question.answerData.customAnswer,
					}]
				default:
					return [question.id, question.answerData.answer]
			}
		})))

		const pointsData = computed(() => props.submission.points || {})
		const maxPointsData = computed(() => Object.fromEntries((props.submission.questions || []).map(question => [ question.id, question.answerData.maxPoints])))

		const onUpdateAnswerPoints = (questionId, points) => {
			emit('update:answer-points', [questionId, points])
		}

		return {
			modelValues,
			pointsData,
			maxPointsData,
			questionTypesComponentReference,

			onUpdateAnswerPoints
		};
	}
}
</script>
<style lang="scss">
.submission-display {
	&__questions-wrapper {
		height: calc(100vh - 87px);
		overflow-y: auto;
	}

	&__content-container {
		max-width: 1000px;
		margin: 0 auto;
	}
}
</style>