<template>
	<div class="submission-review">
		<div class="bg-white pt-5 submission-review__items-wrapper">
			<template v-if="isLoading">
				<div class="h-100 w-100 px-3 py-3 d-flex justify-center align-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>
			<template v-else>
				<div class="px-5">
					<h3>{{ submission.formData.title }}</h3>

					<p
						v-if="submission.formData.description"
						class="text-subtitle-1"
					>
						{{ submission.formData.description }}
					</p>
				</div>

				<div class="submission-review__questions-wrapper pb-5">
					<div class="submission-review__questions px-5">
						<template
							v-for="question in submission.questions"
							:key="question.id"
						>
							<div
								class="w-100 mb-2 bg-white px-3 py-3 rounded question-card"
							>
								<p class="text-subtitle-1">
									{{ question.title }}

									<span
										v-if="question.isRequired || submission.formData.settings.isAllQuestionsRequired"
										class="text-red"
									>*</span>
								</p>
								<component
									v-bind="question.content"
									:is="questionTypesComponentReference[question.type]"
									:isViewingAnswer="true"
									:model-value="modelValues[question.id]"
									@update:model-value.once="updateInitialModelValue(question.id, $event)"
								></component>
							</div>
						</template>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import useSubmissions from '../composables/useSubmissions';
import { computed, ref } from 'vue';

import {
	ShortTextAnswerRenderer,
	DetailedTextAnswerRenderer,

	SingleOptionAnswerRenderer,
	MultipleOptionsAnswerRenderer,

	SingleOptionGridAnswerRenderer,
	MultipleOptionsGridAnswerRenderer,
} from './submit-form/question-renderers/'

import { questionTypesReference } from '../composables/useFormManager'

const questionTypesComponentReference = {
	[questionTypesReference.SHORT_TEXT_ANSWER]: ShortTextAnswerRenderer,
	[questionTypesReference.DETAILED_TEXT_ANSWER]: DetailedTextAnswerRenderer,
	[questionTypesReference.SINGLE_OPTION]: SingleOptionAnswerRenderer,
	[questionTypesReference.MULTIPLE_OPTIONS]: MultipleOptionsAnswerRenderer,
	[questionTypesReference.SINGLE_OPTIONS_GRID]: SingleOptionGridAnswerRenderer,
	[questionTypesReference.MULTIPLE_OPTIONS_GRID]: MultipleOptionsGridAnswerRenderer,
}

export default {
	name: 'SubmissionReview',
	components: {
		ShortTextAnswerRenderer,
		DetailedTextAnswerRenderer,

		SingleOptionAnswerRenderer,
		MultipleOptionsAnswerRenderer,

		SingleOptionGridAnswerRenderer,
		MultipleOptionsGridAnswerRenderer,
	},
	props: {
		submissionId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const {
			submission,
			loadingFlags,
			getSubmission,
		} = useSubmissions()

		const isLoading = computed(() => loadingFlags.getSubmission)

		const modelValues = ref({})
		const updateInitialModelValue = (questionId, value) => {
			modelValues.value[questionId] = value
		}

		getSubmission(props.submissionId)
			.then(() => {
				modelValues.value = Object.fromEntries(submission.value.questions.map(question => {
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
				}))
			})

		return {
			questionTypesComponentReference,

			isLoading,
			submission,
			modelValues,
			updateInitialModelValue,
		}
	}
}
</script>
<style lang="scss">
.submission-review {
	&__questions-wrapper {
		height: calc(100vh - 120px);
		overflow-y: auto;
	}
}
</style>