<template>
	<ui-progress-bar
		v-if="isFormHasAnyTimeLimit"
		parentSelector=".form-submit"
		customClass="global-loader-custom-spacing"
		:progress="timeProgress"
	/>

	<div class="d-flex flex-column pb-5" style="max-width: 1000px; margin: 0 auto;">
		<div class="w-100 mb-2 bg-white px-3 py-3 rounded">
			<div class="w-100 d-flex align-center justify-space-between">
				<h3>{{ formConfig.title }}</h3>

				<p
					v-if="isFormHasAnyTimeLimit"
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

		<template
			v-for="question in formConfig.questions"
			:key="question.id"
		>
			<div class="w-100 mb-2 bg-white px-3 py-3 rounded">
				<p class="text-subtitle-1">
					{{ question.title }}

					<span
						v-if="question.isRequired || formConfig.settings.isAllQuestionsRequired"
						class="text-red"
					>*</span>
				</p>
				<component
					v-bind="question.content"
					v-model="values[question.id]"
					:is="questionTypesComponentReference[question.type]"
				></component>
			</div>
		</template>

		<div>
			<v-btn
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
	name: 'FormSubmitter',
	props: {
		formConfig: {
			type: Object,
			default: () => ({}),
		}
	},
	components: {
		ShortTextAnswerRenderer,
		DetailedTextAnswerRenderer,

		SingleOptionAnswerRenderer,
		MultipleOptionsAnswerRenderer,

		SingleOptionGridAnswerRenderer,
		MultipleOptionsGridAnswerRenderer,
	},
	emits: {
		'submit': null,
	},
	setup(props, { emit }) {
		const {
			isFormHasAnyTimeLimit,
			values,
			makeValuesStructure,
			submitForm,
		} = useFormSubmitManager(props, { emit })

		onBeforeMount(() => {
			makeValuesStructure()
		})

		const timerValue = ref(formatTimerValue(props.formConfig.settings.generalTimeLimit))
		const timeProgress = ref(0)
		const isTimeOut = ref(false)

		let timerInterval = null
		let startedAt = null

		onMounted(() => {
			startedAt = Date.now()

			setTimeout(() => {
				isTimeOut.value = true

				clearInterval(timerInterval)
			}, props.formConfig.settings.generalTimeLimit)

			timerInterval = setInterval(() => {
				timerValue.value = formatTimerValue(props.formConfig.settings.generalTimeLimit - (Date.now() - startedAt))
				timeProgress.value = Math.ceil((Date.now() - startedAt) / props.formConfig.settings.generalTimeLimit * 100)
			}, 1000)
		})

		watch(() => isTimeOut.value, (isTimeOut) => {
			if (isTimeOut) {
				submitForm()
			}
		})

		return {
			values,
			questionTypesComponentReference,
			isFormHasAnyTimeLimit,
			timerValue,
			timeProgress,

			submitForm,
		}
	}
}
</script>
<style>
.global-loader-custom-spacing {
	top: -12px !important;
	left: -12px !important;
	width: 103%;
}
</style>