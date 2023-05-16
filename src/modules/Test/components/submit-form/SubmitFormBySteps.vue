<template>
	<ui-progress-bar
		v-if="isFormHasAnyTimeLimit && isGeneralTimeLimit"
		parentSelector=".form-submit"
		customClass="global-loader-custom-spacing"
		:progress="timeProgress"
	/>

	<div
		class="d-flex flex-column pb-5"
		style="max-width: 1000px; margin: 0 auto;"
	>
		<div class="w-100 mb-2 bg-white px-3 py-3 rounded">
			<div class="w-100 d-flex align-center justify-space-between">
				<h3>{{ formConfig.title }}</h3>

				<p
					v-if="isFormHasAnyTimeLimit && isGeneralTimeLimit"
					class="text-subtitle-1"
				>
					{{ timerValue }}
				</p>
			</div>

			<p
				v-if="formConfig.description"
				class="text-subtitle-1"
			>
				{{ formConfig.description }}
			</p>
		</div>

		<div
			:class="{ 'mb-2 bg-white rounded overflow-hidden' : isFormHasAnyTimeLimit && !isGeneralTimeLimit }"
		>
			<div v-if="isFormHasAnyTimeLimit && !isGeneralTimeLimit">
				<ui-progress-bar
					customClass="global-loader-custom-spacing"
					:progress="timeProgress"
				/>
			</div>

			<div :class="{ 'px-3 py-3': isFormHasAnyTimeLimit && !isGeneralTimeLimit }">
				<template
					v-for="(question, index) in formConfig.questions"
					:key="question.id"
				>
					<div
						v-show="currentQuestionIndex === index"
						class="w-100 mb-2 bg-white px-3 py-3 rounded"
						:class="{ 'mb-2 bg-white px-3 py-3 rounded': isGeneralTimeLimit }"
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
				Назад
			</v-btn>

			<v-btn
				v-if="currentQuestionIndex < formConfig.questions.length - 1 "
				color="primary"
				@click="nextQuestion"
			>
				Следующий
			</v-btn>

			<v-btn
				v-else
				color="primary"
				@click="submitForm"
			>
				Отправить
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

import { questionTypesReference } from '../../models/FormQuestion'

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
			makeValuesStructure,
			submitForm,
		} = useFormSubmitManager(props, { emit })

		const currentQuestionIndex = ref(0)
		let currentQuestionTimeout = null
		let currentQuestionInterval = null

		const nextQuestion = () => {
			currentQuestionIndex.value++

			[currentQuestionTimeout, currentQuestionInterval] = handleNextQuestionWithTimeLimit(currentQuestionTimeout, currentQuestionInterval)
		}

		const handleNextQuestionWithTimeLimit = (currentTimeout, currentInterval) => {
			if (currentQuestionIndex.value > props.formConfig.questions.length - 1) return [ null, null ]

			if (currentTimeout) clearTimeout(currentTimeout)
			if (currentInterval) clearInterval(currentInterval)

			let timeoutStartedAt = Date.now()
			timeProgress.value = 0

			let newTimeout = setTimeout(() => {
				if (currentQuestionIndex.value === props.formConfig.questions.length - 1) {
					submitForm()
				} else {
					nextQuestion()
				}
			}, props.formConfig.settings.questionDefaultTimeLimit)

			let newInterval = setInterval(() => {
				timerValue.value = formatTimerValue(props.formConfig.settings.questionDefaultTimeLimit - (Date.now() - timeoutStartedAt))
				timeProgress.value = Math.ceil((Date.now() - timeoutStartedAt) / props.formConfig.settings.questionDefaultTimeLimit * 100)
			}, 100)

			return [ newTimeout, newInterval ]
		}

		const prevQuestion = () => {
			currentQuestionIndex.value--
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
				// submitForm()
			}
		})

		return {
			questionTypesComponentReference,
			isFormHasAnyTimeLimit,
			isGeneralTimeLimit,

			timerValue,
			timeProgress,

			values,
			currentQuestionIndex,
			nextQuestion,
			prevQuestion,

			submitForm,
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
</style>