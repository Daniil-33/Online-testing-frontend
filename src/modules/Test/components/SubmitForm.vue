<template>
	<template v-if="isLoading">
		<div class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center rounded">
			<ui-loader />
		</div>
	</template>

	<template v-else>
		<template v-if="!isFormSubmitted">
			<!-- <SubmitFormSimple
				:formConfig="formSubmissionConfig"
				@submit="submitSimpleForm"
			/> -->
			<SubmitFormBySteps
				v-if="(isFormHasTimeRestriction && isReadyToStart) || !isFormHasTimeRestriction"
				:formConfig="formSubmissionConfig"
				@submit="submitSimpleForm"
			/>

			<div
				v-else
				class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center flex-column rounded"
			>
				<h3 class="text-center">This form has time restriction<br>Click the button below to start</h3>
				<v-btn
					class="mt-3 mr-auto ml-auto"
					color="primary"
					@click="isReadyToStart = true"
				>
					Start
				</v-btn>
			</div>
		</template>

		<template v-else>
			<div class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center rounded">
				<h3>{{ textAfterSubmit }}</h3>
			</div>
		</template>
	</template>
</template>
<script>
import SubmitFormSimple from './submit-form/SubmitFormSimple.vue';
import SubmitFormBySteps from './submit-form/SubmitFormBySteps.vue';

import useForm from '../composables/useForm'

import { computed, ref } from 'vue';

export default {
	name: 'SubmitForm',
	components: {
		SubmitFormSimple,
		SubmitFormBySteps
	},
	props: {
		formId: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const {
			formSubmissionConfig,
			loadingFlags,
			getFormForSubmission,
			postForm,
		} = useForm();

		const isLoading = computed(() => loadingFlags.getForm || loadingFlags.postForm);

		getFormForSubmission(props.formId);

		const isFormSubmitted = ref(false);
		const textAfterSubmit = ref('');

		const isFormHasTimeRestriction = computed(() => formSubmissionConfig.value.settings.generalTimeLimit > 0 || formSubmissionConfig.value.settings.questionDefaultTimeLimit > 0)
		const isReadyToStart = ref(false);

		const submitSimpleForm = async (answers) => {
			textAfterSubmit.value = await postForm(formSubmissionConfig.value._id, answers);
			isFormSubmitted.value = true;
		}

		return {
			isLoading,
			formSubmissionConfig,
			isFormSubmitted,
			textAfterSubmit,

			isFormHasTimeRestriction,
			isReadyToStart,

			submitSimpleForm,
		};
	}
}
</script>