<template>
	<div class="submissions-list">
		<v-card class="px-5 py-5 submissions-list__items-wrapper">
			<template v-if="isLoading">
				<div class="h-100 w-100 px-3 py-3 d-flex justify-center align-center">
					<v-progress-circular
						indeterminate
						color="primary"
					></v-progress-circular>
				</div>
			</template>
			<template v-else-if="isLoadingCrashed">
				<div class="w-100 px-3 py-3 d-flex justify-center">
					<p class="text-h4 text-center">Щось пішло не так...</p>
				</div>
			</template>
			<template v-else>
				<v-table v-if="!isEmptyList">
					<thead>
						<tr>
							<th>Назва форми</th>
							<th>Дата здачі</th>
							<th>Дата перевірки</th>
							<th>Статус перевірки</th>
							<th>Оцінка</th>
							<th>Дії</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(submission, index) in submissionsList"
							:key="submission._id"
						>
							<td>
								<p v-if="submission.formData">{{ submission.formData.title }}</p>
								<p
									v-else
									class="text-red"
								>
									Форма видалена
								</p>
							</td>
							<td>{{ formatDate(submission.createdOn) }}</td>
							<td>{{ (submission.checkedOn && formatDate(submission.checkedOn)) || '' }}</td>
							<td>
								<v-checkbox-btn
									color="success"
									:readonly="true"
									:model-value="submission.isChecked"
								></v-checkbox-btn>
							</td>
							<td>
								<p>
									<span :class="{ 'text-orange': submission.formData && submission.aggregatedPoints > submission.formData.maxPoints }">{{ submission.aggregatedPoints }}</span>
									/
									<span :class="{ 'text-red': !submission.formData }">{{ submission.formData && submission.formData.maxPoints || 0 }}</span>
								</p>
							</td>
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

									<template v-if="submission.formData">
										<v-list class="list-custom">
											<v-list-item
												active-color="primary"
												v-for="option in actionsOptions"
												:key="option.title"
												@click="option.action(submission._id)"
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
									</template>
									<template v-else>
										<v-card class="px-2 py-2">
											<p>Форма видалена, тому дії з цим <br />результатом не доступні більше</p>
										</v-card>
									</template>
								</v-menu>
							</td>
						</tr>
					</tbody>
				</v-table>
				<div v-else>
					<div class="w-100 px-3 py-3 d-flex justify-center">
						<p class="text-h4 text-center">Ви ще не здали ні однієї форми</p>
					</div>
				</div>
			</template>
		</v-card>
	</div>
</template>

<script>
import SubmissionsListItem from './submissions-list/SubmissionListItem.vue';

import { computed, ref } from 'vue'
import useSubmissions from '../composables/useSubmissions'
import { formatDate } from '@/helpers/dateHelper'
import { safeAsyncCall } from '@/helpers/utilsHelper'
import { useRouter } from 'vue-router'

export default {
	name: 'SubmissionsList',
	components: {
		SubmissionsListItem,
	},
	setup(props) {
		const router = useRouter()
		const {
			getSubmissions,
			submissionsList,
			loadingFlags
		} = useSubmissions()

		const isLoadingCrashed = ref(false)
		const loadData = async () => {
			const [error, result] = await safeAsyncCall(getSubmissions())

			if (error) {
				isLoadingCrashed.value = true
			}
		}

		loadData()

		const isLoading = computed(() => loadingFlags.getSubmissions)
		const isEmptyList = computed(() => {
			return submissionsList.value.length === 0
		})

		const actionsOptions = [
			{
				title: 'Переглянути деталі',
				icon: 'mdi-open-in-new',
				action: (id) => {
					router.push({
						name: 'Submission Review',
						params: { id, },
					})
				},
			},
			{
				title: 'Здати знову',
				icon: 'mdi-format-list-bulleted',
				action: (id) => {
					router.push({
						name: 'Submit Form',
						params: { id, },
					})
				},
			},
		]


		return {
			isEmptyList,
			isLoading,
			submissionsList,
			actionsOptions,
			isLoadingCrashed,
			formatDate,
		}
	},
}
</script>
<style scoped lang="scss">
.submissions-list {
	&__items {
		&-wrapper {
			height: calc(100vh - 25px);
			overflow-y: auto;
		}

		display: flex;
		flex-direction: column;

		& > *:not(:first-child) {
			margin-top: 12px;
		}
	}
}
</style>