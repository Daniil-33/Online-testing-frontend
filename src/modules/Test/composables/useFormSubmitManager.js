import { ref, computed } from 'vue'

export default function useFormSubmitManager(props, { emit }) {
	const isFormHasAnyTimeLimit = computed(() => props.formConfig.settings.generalTimeLimit > 0 || props.formConfig.settings.questionDefaultTimeLimit > 0)

	const values = ref({})
	const validationFlags = ref({})

	const makeValidationFlagsStructure = () => {
		validationFlags.value = props.formConfig.questions.reduce((acc, question) => {
			if (question.isRequired) {
				acc[question.id] = {}
			}

			return acc
		}, {})
	}

	const makeValuesStructure = () => {
		values.value = props.formConfig.questions.reduce((acc, question) => {
			acc[question.id] = {}
			return acc
		}, {})
	}

	const submitForm = () => {
		emit('submit', values.value)
	}

	return {
		isFormHasAnyTimeLimit,
		values,

		makeValuesStructure,
		makeValidationFlagsStructure,
		submitForm,
	}
}