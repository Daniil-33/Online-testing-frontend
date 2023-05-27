<template>
	<div class="h-100">
		<v-card class="px-5 py-5 mb-5">
			<div class="w-100 d-flex align-center justify-space-between mb-3">
				<h2>{{isEditing ? 'Редагування форми' : 'Створення нової форми'}}</h2>

				<div class="d-flex">
					<v-btn
						v-if="isEditing"
						class="ml-2"
						size="small"
						:loading="isSaving"
						:disabled="isSaving"
						@click="onSaveHandler"
					>
						<v-icon icon="mdi-open-in-new" left/>

						Переглянути
					</v-btn>
					<v-btn
						v-if="isEditing"
						class="ml-2"
						size="small"
						:loading="isSaving"
						:disabled="isSaving"
						@click="onSaveHandler"
					>
						<v-icon icon="mdi-refresh" left/>

						Оновити
					</v-btn>
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

						Сберегти
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
				<div class="loader-fill-height">
					<div class="d-flex align-center h-100 w-100 justify-center">
						<v-progress-circular
							indeterminate
							color="primary"
						></v-progress-circular>
					</div>
				</div>
			</v-card>
		</template>
		<template v-else-if="isLoadingCrashed">
			<div class="w-100 px-3 py-3 d-flex justify-center">
				<p class="text-h4 text-center">Щось пішло не так...</p>
			</div>
		</template>
		<template v-else>
			<v-window
				v-model="tab"
				class="px-5 create-test-container"
				style="height: calc(100vh - 162px); overflow-y: auto;"
			>
				<v-window-item value="questions">
					<FormQuestionsAggregator
						:questions="questions"
						:isTimeLimitActive="isTimeLimitActive"
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
												<h5 class="text-h5">Назва форми</h5>
												<v-text-field
													label=""
													variant="underlined"
													color="primary"
													v-model="title"
												></v-text-field>
											</div>
											<div class="">
												<h6 class="text-h6">Опис форми</h6>
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
					<FormSubmissions
						:form="form"
					/>
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
import { safeAsyncCall } from '@/helpers/utilsHelper'

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
				title: 'Питання',
				value: 'questions',
			},
			{
				title: 'Результати',
				value: 'submissions',
			},
			{
				title: 'Налаштування',
				value: 'settings',
			},
		];
		const tab = ref(tabs[0].value);

		const isTimeLimitActive = computed(() => {
			return settings.value.questionDefaultTimeLimit > 0;
		});
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

		const isLoadingCrashed = ref(false)
		const loadData = async () => {
			const [error, result] = await safeAsyncCall(getForm(props.formId))

			if (error) {
				isLoadingCrashed.value = true
				return
			}

			syncWithConfig(form.value)
			isFormObjectReady.value = true;
		}

		if (isEditing) {
			loadData()
		}

		const isLoading = computed(() => loadingFlags.getForm);
		const isSaving = computed(() => loadingFlags.updateForm);
		const isFormObjectReady = ref(false);

		const onSaveHandler = () => {
			safeAsyncCall(updateForm({
				id: props.formId,
				data: toConfig()
			}))
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

		return {
			tabs,
			tab,

			title,
			description,
			isTimeLimitActive,


			questions,
			addQuestion,
			removeQuestion,
			duplicateQuestion,
			updateQuestion,

			settings,
			updateSettings,

			form,
			isEditing,
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

.loader-fill-height {
	height: calc(100vh - 203px) !important;
}
</style>