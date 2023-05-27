<template>
	<div
		v-if="isLoadingList"
		class=""
	>
		<div class="d-flex align-center h-100 w-100 justify-center">
			<v-progress-circular
				indeterminate
				color="primary"
			></v-progress-circular>
		</div>
	</div>

	<v-table v-else>
		<thead>
			<tr>
				<th>№</th>
				<th>Дата здачі</th>
				<th>Електронна пошта</th>
				<th>Дата перевірки</th>
				<th>Перевірено особисто</th>
				<th>Оцінка</th>
				<th>Дії</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(submission, index) in formSubmissionsList"
				:key="submission._id"
			>
				<td>{{ index + 1 }}</td>
				<td>{{ formatDate(submission.createdOn) }}</td>
				<td>{{ submission.submitterData.email }}</td>
				<td>{{ (submission.checkedOn && formatDate(submission.checkedOn)) || '' }}</td>
				<th>
					<v-checkbox-btn
						readonly
						color="success"
						:model-value="submission.isChecked"
					></v-checkbox-btn>
				</th>
				<th>
					<span :class="{ 'text-orange': submission.aggregatedPoints > submission.maxFormPoints }">{{ submission.aggregatedPoints }}</span>
					 / {{ submission.maxFormPoints }}</th>
				<td>
					<v-menu
						@click.stop
					>
						<template v-slot:activator="{ props }">
							<v-btn
								size="small"
								flat
								icon="mdi-dots-vertical"
								v-bind="props"
							></v-btn>
						</template>

						<v-list class="list-custom">
							<v-list-item
								active-color="primary"
								v-for="option in actionsOptions"
								:key="option.title"
								@click="onActionClick(option.action, submission._id)"
							>
								<div class="d-flex">
									<v-icon
										size="small"
										:icon="option.icon"
									></v-icon>

									<v-list-item-title class="ml-2">
										{{ option.title }}
									</v-list-item-title>
								</div>
							</v-list-item>
						</v-list>
					</v-menu>
				</td>
			</tr>
		</tbody>
	</v-table>

	<v-dialog
		v-model="isViewingSubmission"
		width="auto"
    >
	  <v-card>
		<v-card-title>
			<div class="w-100 d-flex align-center justify-space-between">
				<span class="text-h5">Перегляд результату</span>
				<v-btn
					text
					flat
					size="small"
					@click="isViewingSubmission = false"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</div>
		</v-card-title>

		<v-card-text>
			<template v-if="isLoadingSingleSubmission">
				<div class="loader-fill-height">
					<div class="d-flex align-center h-100 w-100 justify-center">
						<v-progress-circular
							indeterminate
							color="primary"
						></v-progress-circular>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="submission-review-area">
					<SubmissionDisplay
						:submission="viewingSubmissionWithMutatedPoints"
						:settingPoints="true"
						@update:answer-points="onChangeAnswerPoints"
					/>
				</div>
			</template>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>

            <v-btn
				color="primary"
				:loading="isUpdatingPoints"
				:disabled="isUpdatingPoints"
				@click="onUpdatePointsClick"
			>
				Завершити перевірку
			</v-btn>
          </v-card-actions>
	  </v-card>
	</v-dialog>

	<ConfirmDeleteModal
		ref="confirmModal"
		:loading="isDeleting"
	/>
</template>
<script>
import useSubmissions from '../../../composables/useSubmissions';
import useForm from '../../../composables/useForm';

import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue';
import SubmissionDisplay from '../../submit-form/SubmissionDisplay.vue';

import { formatDate } from '@/helpers/dateHelper';
import { ref, computed } from 'vue';

export default {
	name: 'FormSubmissionsTable',
	components: {
		ConfirmDeleteModal,
		SubmissionDisplay,
	},
	props: {
		form: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		const viewType = ref('table');

		const {
			submission,
			loadingFlags: submissionLoadingFlags,
			getSubmission,
			updateSubmissionPoints,
		} = useSubmissions();

		const {
			loadingFlags: formLoadingFlags,
			formSubmissionsList,
			getFormSubmissions,
			deleteFormSubmission,
		} = useForm();

		const confirmModal = ref(null);
		const singleLoadedSubmissions = ref({});
		const isViewingSubmission = ref(false);

		const viewingSubmission = ref({});
		const currentViewingSubmissionPointsData = ref({});
		const viewingSubmissionWithMutatedPoints = computed(() => ({
			...viewingSubmission.value,
			submissionData: {
				...viewingSubmission.value.submissionData,
				points: currentViewingSubmissionPointsData.value,
			},
		}))

		const onChangeAnswerPoints = ([questionId, points]) => {
			currentViewingSubmissionPointsData.value = {
				...currentViewingSubmissionPointsData.value,
				[questionId]: points,
			}
		}

		const onUpdatePointsClick = async () => {
			await updateSubmissionPoints(viewingSubmission.value._id, currentViewingSubmissionPointsData.value);

			isViewingSubmission.value = false;

			loadList()
		}

		const isDeleting = computed(() => formLoadingFlags.deleteSubmission);
		const isLoadingList = computed(() => formLoadingFlags.getSubmissions);
		const isUpdatingPoints = computed(() => submissionLoadingFlags.updateSubmissionPoints);
		const isLoadingSingleSubmission = computed(() => submissionLoadingFlags.getSubmission);

		getFormSubmissions(props.form._id)

		const loadList = () => {
			singleLoadedSubmissions.value = {};
			getFormSubmissions(props.form._id)
		}

		const onActionClick = (action, submissionId) => {
			switch (action) {
				case 'delete':
					onDeleteClick(submissionId);
					break;
				case 'checkOut':
					onCheckOutClick(submissionId);
					break;
			}
		}

		const onDeleteClick = async (submissionId) => {
			const isConfirmed = await confirmModal.value.requestConfirmation({
				title: 'Видалення результату',
				text: 'Ви впевнені, що хочете видалити цей результат?',
			})

			if (!isConfirmed) return

			await deleteFormSubmission(props.form._id, submissionId);

			confirmModal.value.closeModal();

			loadList();
		}

		const onCheckOutClick = async (submissionId) => {
			isViewingSubmission.value = true;

			if (singleLoadedSubmissions.value[submissionId]) {
				viewingSubmission.value = singleLoadedSubmissions.value[submissionId];
				return;
			} else {
				await getSubmission(submissionId);

				singleLoadedSubmissions.value[submissionId] = { ...submission.value };
				viewingSubmission.value = singleLoadedSubmissions.value[submissionId];
			}

			currentViewingSubmissionPointsData.value = viewingSubmission.value.submissionData.points;
		}

		const actionsOptions = [
			{
				title: 'Переглянути',
				icon: 'mdi-file-check-outline ',
				action: 'checkOut'
			},
			{
				title: 'Видалити',
				icon: 'mdi-trash-can-outline',
				action: 'delete'
			},
		]

		return {
			viewType,

			formSubmissionsList,
			isLoadingList,
			isDeleting,
			viewingSubmissionWithMutatedPoints,
			isViewingSubmission,
			isLoadingSingleSubmission,
			isUpdatingPoints,
			formatDate,
			onChangeAnswerPoints,
			onUpdatePointsClick,

			actionsOptions,
			onActionClick,

			confirmModal,
		}
	}
};
</script>
<style lang="scss">
.submission-review-area {
	background-color: rgba(235, 235, 235, 1);
	padding: 10px;
	border-radius: 4px;

	& .submission-display__questions-wrapper {
		height: calc(100vh - 207px);
	}
}
</style>