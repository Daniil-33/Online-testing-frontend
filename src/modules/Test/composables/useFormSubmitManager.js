import { questionTypesReference } from './useFormManager'
import { ref, computed } from 'vue'

const isShortTextAnswered = (value) => {
	return value !== ''
}

const isDetailedTextAnswered = (value) => {
	return value !== ''
}

const isSingleOptionAnswered = (value) => {
	return value.selected !== ''
}

const isMultipleOptionAnswered = (value) => {
	return value.selected.length > 0
}

const isSingleOptionGridAnswered = (value) => {
	return Object.values(value).every((v) => v !== null)
}

const isMultipleOptionGridAnswered = (value) => {
	return Object.values(value).every((v) => v.length > 0)
}

const getRequiredValidator = (questionType) => {
	switch (questionType) {
		case questionTypesReference.SHORT_TEXT_ANSWER:
			return isShortTextAnswered
		case questionTypesReference.DETAILED_TEXT_ANSWER:
			return isDetailedTextAnswered
		case questionTypesReference.SINGLE_OPTION:
			return isSingleOptionAnswered
		case questionTypesReference.MULTIPLE_OPTIONS:
			return isMultipleOptionAnswered
		case questionTypesReference.SINGLE_OPTIONS_GRID:
			return isSingleOptionGridAnswered
		case questionTypesReference.MULTIPLE_OPTIONS_GRID:
			return isMultipleOptionGridAnswered
		default:
			return () => true
	}
}

export default function useFormSubmitManager(props, { emit }) {
	const isFormHasAnyTimeLimit = computed(() => props.formConfig.settings.generalTimeLimit > 0 || props.formConfig.settings.questionDefaultTimeLimit > 0)

	const values = ref({})
	const isTouchedByValidator = ref(false)
	const errors = ref({})

	const getQuestion = (questionId) => {
		return props.formConfig.questions.find((question) => question.id === questionId)
	}

	const validateAnswer = (questionId, isAllQuestionsRequired) => {
		const question = getQuestion(questionId)

		if (!errors.value[questionId]) {
			errors.value[questionId] = {}
		}

		if (question.isRequired || isAllQuestionsRequired) {
			const requiredValidator = getRequiredValidator(question.type)
			const isAnswered = requiredValidator(values.value[questionId])

			if (!isAnswered) {
				errors.value[questionId].required = true
			} else {
				errors.value[questionId] = {
					...errors.value[questionId],
					required: false,
				}
			}
		}

		// here can be added additional validation rules
	}

	const validateAllAnswers = (touch) => {
		props.formConfig.questions.forEach((question) => {
			validateAnswer(question.id, props.formConfig.settings.isAllQuestionsRequired)
		})

		if (touch) {
			touchValidation()
		}
	}

	const touchValidation = () => isTouchedByValidator.value = true

	const unTouchValidation = () => isTouchedByValidator.value = false

	const makeValuesStructure = () => {
		values.value = props.formConfig.questions.reduce((acc, question) => {
			acc[question.id] = {}
			return acc
		}, {})
	}

	const submitForm = (successValidationCallback, isTimeOut) => {
		validateAllAnswers(true)

		if (Object.values(errors.value).some((error) => Object.values(error).some((errorValue) => errorValue)) && !isTimeOut) {
			return
		}

		successValidationCallback(values.value)
	}

	return {
		isFormHasAnyTimeLimit,
		values,
		errors,
		isTouchedByValidator,

		validateAllAnswers,
		validateAnswer,
		touchValidation,
		unTouchValidation,

		makeValuesStructure,
		submitForm,
	}
}