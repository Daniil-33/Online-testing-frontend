<template>
	<div
		class="d-flex flex-column pb-5"
		style="max-width: 1000px; margin: 0 auto;"
	>
		<div class="w-100 mb-2 bg-white px-3 py-3 rounded">
			<div class="w-100 d-flex align-center justify-space-between">
				<h3>{{ formConfig.title }}</h3>
			</div>

			<p
				v-if="formConfig.description"
				class="text-subtitle-1"
			>
				{{ formConfig.description }}
			</p>
		</div>

		<div
			class="mb-2 bg-white rounded overflow-hidden question-card"
			:class="{
				'question-card--error': currentQuestionRequiredError && isTouchedByValidator
			}"
		>
			<div v-if="isFormHasAnyTimeLimit">
				<ui-progress-bar
					customClass="global-loader-custom-spacing"
					:progress="timeProgress"
				/>
			</div>

			<div class="px-3 py-3">
				<template
					v-for="(question, index) in formConfig.questions"
					:key="question.id"
				>
					<div
						v-show="currentQuestionIndex === index"
					>
						<div class="w-100 d-flex align-center justify-space-between">
							<p class="text-subtitle-1">
								{{ question.title }}

								<span
									v-if="question.isRequired || formConfig.settings.isAllQuestionsRequired"
									class="text-red"
								>*</span>
							</p>

							<p
								v-if="isFormHasAnyTimeLimit && !isGeneralTimeLimit"
								class="text-subtitle-1"
							>
								{{ timerValue }}
							</p>
						</div>

						<component
							v-bind="question.content"
							v-model="values[question.id]"
							:is="questionTypesComponentReference[question.type]"
						></component>
					</div>
				</template>
			</div>
		</div>


		<div>
			<v-btn
				v-if="currentQuestionIndex > 0 && (isFormHasAnyTimeLimit && isGeneralTimeLimit || !isFormHasAnyTimeLimit)"
				color="text"
				class="mr-2"
				@click="prevQuestion"
			>
				Попереднє питання
			</v-btn>

			<v-btn
				v-if="currentQuestionIndex < formConfig.questions.length - 1 "
				color="primary"
				@click="nextQuestion(false)"
			>
				Наступне питання
			</v-btn>

			<v-btn
				v-else
				color="primary"
				@click="submit(false)"
			>
				Відправити
			</v-btn>
		</div>
	</div>
</template>
<script>
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

import { ref, computed, onBeforeMount, watch, onMounted } from 'vue'
import useFormSubmitManager from '../../composables/useFormSubmitManager'
import { formatTimerValue } from '@/helpers/dateHelper'

export default {
	name: 'SubmitFormBySteps',
	props: {
		formConfig: {
			type: Object,
			default: () => ({}),
		}
	},
	emits: {
		'submit': null,
	},
	components: {
		ShortTextAnswerRenderer,
		DetailedTextAnswerRenderer,

		SingleOptionAnswerRenderer,
		MultipleOptionsAnswerRenderer,

		SingleOptionGridAnswerRenderer,
		MultipleOptionsGridAnswerRenderer,
	},
	setup(props, { emit }) {
		const {
			isFormHasAnyTimeLimit,
			values,
			errors,
			isTouchedByValidator,

			validateAnswer,
			makeValuesStructure,
			touchValidation,
			unTouchValidation,
			submitForm,
		} = useFormSubmitManager(props, { emit })

		const currentQuestionRequiredError = computed(() => {
			const question = props.formConfig.questions[currentQuestionIndex.value]

			return errors.value?.[question.id]?.required
		})

		const currentQuestionIndex = ref(0)
		let currentQuestionTimeout = null
		let currentQuestionInterval = null

		const handleNextQuestionWithTimeLimit = (currentTimeout, currentInterval) => {
			if (currentQuestionIndex.value > props.formConfig.questions.length - 1) return [ null, null ]

			if (currentTimeout) clearTimeout(currentTimeout)
			if (currentInterval) clearInterval(currentInterval)

			let timeoutStartedAt = Date.now()
			timeProgress.value = 0

			let newTimeout = setTimeout(() => {
				if (currentQuestionIndex.value === props.formConfig.questions.length - 1) {
					submit(true)
				} else {
					nextQuestion(true)
				}
			}, props.formConfig.settings.questionDefaultTimeLimit)

			let newInterval = setInterval(() => {
				timerValue.value = formatTimerValue(props.formConfig.settings.questionDefaultTimeLimit - (Date.now() - timeoutStartedAt))
				timeProgress.value = Math.ceil((Date.now() - timeoutStartedAt) / props.formConfig.settings.questionDefaultTimeLimit * 100)
			}, 100)

			return [ newTimeout, newInterval ]
		}

		const nextQuestion = (isTimeOut) => {
			if (!isTimeOut) {
				validateAnswer(
					props.formConfig.questions[currentQuestionIndex.value].id,
					props.formConfig.settings.isAllQuestionsRequired
				)
				touchValidation()

				if (errors.value[props.formConfig.questions[currentQuestionIndex.value].id]?.required) return
			}

			unTouchValidation()
			currentQuestionIndex.value++

			[currentQuestionTimeout, currentQuestionInterval] = handleNextQuestionWithTimeLimit(currentQuestionTimeout, currentQuestionInterval)
		}

		const prevQuestion = () => {
			currentQuestionIndex.value--
		}

		const submit = (isTimeOut) => {
			submitForm((formValues) => emit('submit', formValues), isTimeOut)
		}

		onBeforeMount(() => {
			makeValuesStructure()
		})

		const isGeneralTimeLimit = computed(() => props.formConfig.settings.generalTimeLimit > 0)
		const timerValue = ref(formatTimerValue(props.formConfig.settings.generalTimeLimit))
		const timeProgress = ref(0)
		const isTimeOut = ref(false)

		onMounted(() => {
			if (isGeneralTimeLimit.value) {
				let timerInterval = null
				let startedAt = Date.now()

				setTimeout(() => {
					isTimeOut.value = true

					clearInterval(timerInterval)
				}, props.formConfig.settings.generalTimeLimit)

				timerInterval = setInterval(() => {
					timerValue.value = formatTimerValue(props.formConfig.settings.generalTimeLimit - (Date.now() - startedAt))
					timeProgress.value = Math.ceil((Date.now() - startedAt) / props.formConfig.settings.generalTimeLimit * 100)
				}, 100)
			} else {
				[currentQuestionTimeout, currentQuestionInterval] = handleNextQuestionWithTimeLimit()
			}
		})

		watch(() => isTimeOut.value, (isTimeOut) => {
			if (isTimeOut) {
				submit(true)
			}
		})

		watch(() => values.value, () => {
			if (isTouchedByValidator.value) {
				validateAnswer(
					props.formConfig.questions[currentQuestionIndex.value].id,
					props.formConfig.settings.isAllQuestionsRequired
				)
			}
		}, { deep: true })

		return {
			questionTypesComponentReference,
			isFormHasAnyTimeLimit,
			currentQuestionRequiredError,

			timerValue,
			timeProgress,

			values,
			errors,
			isTouchedByValidator,
			currentQuestionIndex,
			nextQuestion,
			prevQuestion,

			submit,
		}
	}
}
</script>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}

.question-card {
	border: 1px solid transparent;
	transition: all .1s linear;
}

.question-card--error {
	border: 1px solid red;
}
</style>