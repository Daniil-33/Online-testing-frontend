<template>
	<div class="forms-list">
		<v-card class="px-3 py-3">
			<div class="w-100 d-flex align-items-center justify-space-between">
				<v-btn
					color="primary"
					size="small"
					@click="onNewFormClick"
				>
					<v-icon icon="mdi-plus" left/>
					Нова форма
				</v-btn>
			</div>
		</v-card>

		<v-card class="px-5 py-5 mt-3 forms-list__items-wrapper">
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
							<th>Дата створення</th>
							<th>Дата останніх змін</th>
							<th>Кількість результатів</th>
							<th>Дії</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(form, index) in formsList"
							:key="form._id"
						>
							<td>{{ form.title }}</td>
							<td>{{ formatDate(form.createdOn) }}</td>
							<td>{{ formatDate(form.updatedOn) }}</td>
							<td>{{ form.submissionsCount }}</td>
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
											@click="onActionClick(option, form._id)"
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

				<div v-else>
					<div class="w-100 px-3 py-3 d-flex justify-center">
						<p class="text-h4 text-center">Ви ще не створили ні однієї форми</p>
					</div>
				</div>
			</template>
		</v-card>
	</div>

	<ConfirmDeleteModal
		ref="confirmModal"
		:loading="isDeleting"
	/>
</template>
<script>
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue';

import useForm from '../composables/useForm';
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/helpers/dateHelper'
import { safeAsyncCall } from '@/helpers/utilsHelper'

export default {
	name: 'FormsListView',
	components: {
		ConfirmDeleteModal
	},
	setup() {
		const confirmModal = ref(null)
		const router = useRouter()
		const {
			formsList,
			loadingFlags,
			getFormsList,
			deleteForm,
		} = useForm()

		const isLoadingCrashed = ref(false)
		const isLoading = computed(() => loadingFlags.getForm)
		const isDeleting = computed(() => loadingFlags.deleteForm)
		const isEmptyList = computed(() => {
			return formsList.value.length === 0
		})

		const onDeleteClick = async (id) => {
			const isConfirm = await confirmModal.value.requestConfirmation({
				title: 'Видалення форми',
				text: 'Ви впевнені, що хочете видалити цю форму? Всі результати будуть видалені без можливості відновлення.',
			})

			if (!isConfirm) return confirmModal.value.closeModal()

			await deleteForm(id)

			confirmModal.value.closeModal()
		}

		const onNewFormClick = () => {
			router.push({ name: 'New Form' })
		}

		const onActionClick = (item, formId) => {
			if (item.to) {
				const routeData = router.resolve(item.to(formId));

				window.open(routeData.href, '_blank');
			} else if (item.action) {
				item.action(formId)
			}
		}

		const actionsOptions = [
			{
				title: 'Редагувати',
				icon: 'mdi-pencil',
				to: (id) =>  ({ name: 'Edit Form', params: { id} }),
			},
			{
				title: 'Переглянути у новій вкладці',
				icon: 'mdi-open-in-new',
				to: (id) => ({ name: 'Submit Form', params: { id } }),
			},
			{
				title: 'Видалити',
				icon: 'mdi-trash-can-outline',
				action: onDeleteClick,
			},
		]

		const loadData = async () => {
			const [error, result] = await safeAsyncCall(getFormsList())

			if (error) {
				isLoadingCrashed.value = true
			}
		}

		loadData()

		return {
			confirmModal,
			isEmptyList,
			formsList,
			isLoading,
			isDeleting,
			actionsOptions,
			onActionClick,
			formatDate,
			onNewFormClick,
		}
	}
}
</script>
<style scoped lang="scss">
.forms-list {
	&__items {
		&-wrapper {
			height: calc(100vh - 89px);
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