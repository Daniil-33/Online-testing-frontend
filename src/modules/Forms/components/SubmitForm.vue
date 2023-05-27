<template>
	<template v-if="isLoading">
		<div class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center rounded">
			<ui-loader />
		</div>
	</template>
	<template v-else-if="isLoadingCrashed">
		<div class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center rounded">
			<h3>Щось пішло не так...</h3>
		</div>
	</template>

	<template v-else>
		<template v-if="!isFormSubmitted">
			<template v-if="(isFormHasTimeRestriction && isReadyToStart) || !isFormHasTimeRestriction">
				<component
					:is="renderComponent"
					:formConfig="formSubmissionConfig"
					@submit="submitSimpleForm"
				/>
			</template>

			<div
				v-else
				class="bg-white w-100 h-100 px-3 py-3 d-flex align-center justify-center flex-column rounded"
			>
				<h3 class="text-center">Ця форма має обмеження за часом<br>Натисніть кнопку нижче щоб почати</h3>
				<v-btn
					class="mt-3 mr-auto ml-auto"
					color="primary"
					@click="isReadyToStart = true"
				>
					Почати
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
import { safeAsyncCall } from '@/helpers/utilsHelper'
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

		const isLoadingCrashed = ref(false);
		const loadData = async () => {
			const [error, result] = await safeAsyncCall(getFormForSubmission(props.formId));

			if(error) {
				isLoadingCrashed.value = true;
			}
		}

		loadData()

		const renderComponent = computed(() => {
			switch(formSubmissionConfig.value?.settings?.formView) {
				case 'list':
					return SubmitFormSimple;
				case 'steps':
					return SubmitFormBySteps;
				default:
					return SubmitFormSimple;
			}
		})

		const isLoading = computed(() => loadingFlags.getForm || loadingFlags.postForm);

		const isFormSubmitted = ref(false);
		const textAfterSubmit = ref('');

		const isFormHasTimeRestriction = computed(() => formSubmissionConfig.value.settings.generalTimeLimit > 0 || formSubmissionConfig.value.settings.questionDefaultTimeLimit > 0)
		const isReadyToStart = ref(false);

		const submitSimpleForm = async (answers) => {
			textAfterSubmit.value = await postForm(formSubmissionConfig.value._id, answers);
			isFormSubmitted.value = true;
		}

		return {
			renderComponent,

			isLoading,
			formSubmissionConfig,
			isFormSubmitted,
			textAfterSubmit,

			isFormHasTimeRestriction,
			isReadyToStart,
			isLoadingCrashed,

			submitSimpleForm,
		};
	}
}
</script>