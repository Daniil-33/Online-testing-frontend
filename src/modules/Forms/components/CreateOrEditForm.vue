<template>
	<div>
		<v-card class="px-5 py-5">
			<div class="w-100 d-flex align-center justify-space-between mb-3">
				<h2>{{isEditing ? 'Editing form' : 'Create new form'}}</h2>

				<div class="d-flex">
					<v-btn
						v-if="isEditing"
						color="primary"
						class="ml-2"
						size="small"
						:loading="isSaving"
						:disabled="isSaving"
						@click="onSaveHandler"
					>
						<v-icon icon="mdi-content-save" left/>

						Save
					</v-btn>
				</div>
			</div>
			<v-tabs v-model="tab" style="margin-bottom: -20px;">
				<v-tab
					color="primary"
					v-for="tab in tabs"
					:key="tab.value"
					:value="tab.value"
				>
					{{ tab.title }}
				</v-tab>
			</v-tabs>
		</v-card>

		<template v-if="!isFormObjectReady">
			<v-card class="px-5 py-5 mt-3">
				<div class="d-flex w-100 justify-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</v-card>
		</template>
		<template v-else>
			<v-window
				v-model="tab"
				class="px-5 py-5 create-test-container"
				style="height: calc(100vh - 136px); overflow-y: auto;"
			>
				<v-window-item value="questions">
					<FormQuestionsAggregator
						:questions="questions"
						:isTestModeActive="isTestModeActive"
						@add:question="addQuestion"
						@remove:question="removeQuestion"
						@duplicate:question="duplicateQuestion"
						@update:question="updateQuestion"
					>
						<template v-slot:form-header>
							<v-card class="question-form mb-3">
								<v-card-text>
									<v-row>
										<v-col cols="12">
											<div class="">
												<h5 class="text-h5">From Title</h5>
												<v-text-field
													label=""
													variant="underlined"
													color="primary"
													v-model="title"
												></v-text-field>
											</div>
											<div class="">
												<h6 class="text-h6">From Description</h6>
												<v-text-field
													label=""
													variant="underlined"
													color="primary"
													v-model="description"
												></v-text-field>
											</div>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</template>
					</FormQuestionsAggregator>
				</v-window-item>

				<v-window-item value="submissions">
					<FormSubmissions />
				</v-window-item>

				<v-window-item value="settings">
					<FormSettings
						:settings="settings"
						@update:settings="updateSettings"
					/>
				</v-window-item>
			</v-window>
		</template>
	</div>
</template>
<script>
import FormQuestionsAggregator from './create-or-edit-form/FormQuestionsAggregator.vue';
import FormSettings from './create-or-edit-form/FormSettings.vue';
import FormSubmissions from './create-or-edit-form/FormSubmissions.vue';

import { useFormManager } from '../composables/useFormManager';
import useForm from '../composables/useForm'

import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
	name: 'CreateOrEditForm',
	components: {
		FormQuestionsAggregator,
		FormSettings,
		FormSubmissions
	},
	props: {
		formId: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const router = useRouter();
		const tabs = [
			{
				title: 'Questions',
				value: 'questions',
			},
			{
				title: 'Submissions',
				value: 'submissions',
			},
			{
				title: 'Settings',
				value: 'settings',
			},
		];
		const tab = ref(tabs[0].value);

		const isEditing = computed(() => {
			return props.formId !== null;
		});

		const {
			title,
			description,

			settings,
			updateSettings,

			questions,
			addQuestion,
			removeQuestion,
			duplicateQuestion,
			updateQuestion,

			toConfig,
			syncWithConfig
		} = useFormManager()

		const {
			form,
			loadingFlags,

			addForm,
			updateForm,
			getForm,
		} = useForm()

		if (isEditing) {
			getForm(props.formId)
				.then(() => {
					syncWithConfig(form.value)
					isFormObjectReady.value = true;
				})
		}

		const isLoading = computed(() => loadingFlags.getForm);
		const isSaving = computed(() => loadingFlags.updateForm);
		const isFormObjectReady = ref(false);

		const isTestModeActive = computed(() => settings.value.isTest);

		const onSaveHandler = () => {
			updateForm({
				id: props.formId,
				data: toConfig()
			})
		}

		onMounted(async () => {
			if (!isEditing.value) {
				const formId = await addForm(toConfig())

				router.push({
					name: 'Edit Form',
					params: {
						id: formId
					}
				})
			}
		})

		// TODO
		// watch(() => formSettings.model.value.questionDefaultTimeLimit, (value) => {
		// 	questions.value.forEach((question) => {
		// 		!question.model.timeLimit && question.setTimeLimit(value);
		// 	});
		// })

		return {
			tabs,
			tab,

			title,
			description,


			questions,
			addQuestion,
			removeQuestion,
			duplicateQuestion,
			updateQuestion,

			settings,
			updateSettings,

			isEditing,
			isTestModeActive,
			isSaving,
			isLoading,
			isFormObjectReady,

			onSaveHandler
		};
	}
};
</script>
<style>
.create-test-container .v-window__container{
	height: unset;
}
</style>