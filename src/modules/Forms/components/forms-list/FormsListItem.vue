<template>
	<div
		class="form-list-item"
		@click="$router.push({ name: 'Edit Form', params: { id: form._id } })"
	>
		<div class="form-list-item__right">
			<v-icon color="primary" icon="mdi-format-list-bulleted"></v-icon>

			<p class="text-h6 ml-2">{{ form.title }}</p>
		</div>
		<div class="form-list-item__left">
			<p class="form-date text-muted">{{ formatDate(form.createdOn) }}</p>

			<div @click.stop>
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

					<FormContextMenu
						:id="form._id"
						@delete="onFormDelete"
					/>
				</v-menu>
			</div>
		</div>
	</div>

	<ConfirmDeleteModal
		v-model="isDeleteModalOpen"
		:payload="confirmDeletePayload"
		@confirm="onConfirmDelete"
	/>
</template>
<script>
import FormContextMenu from './FormContextMenu.vue';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue';

import { formatDate } from '@/helpers/dateHelper'
import { ref } from 'vue'

export default {
	name: 'FormListItem',
	components: {
		FormContextMenu,
		ConfirmDeleteModal
	},
	props: {
		form: {
			type: Object,
			default: () => {
				return {
					_id: 0,
					title: '',
					createdOn: ''
				}
			}
		}
	},
	emits: ['deleteForm'],
	setup(props, { emit }) {
		const confirmDeletePayload = {
			title: 'Delete Form',
			text: 'Are you sure you want to delete this form?'
		}

		const isDeleteModalOpen = ref(false)

		const onFormDelete = () => {
			isDeleteModalOpen.value = true
		}

		const onConfirmDelete = () => {
			isDeleteModalOpen.value = false

			emit('deleteForm', props.form._id)
		}

		return {
			isDeleteModalOpen,
			confirmDeletePayload,
			formatDate,
			onFormDelete,
			onConfirmDelete
		}
	}
}
</script>
<style scoped lang="scss">
.form-list-item {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 8px 8px;
	cursor: pointer;
	transition: all .1s linear;
	border-radius: 4px;

	&:hover {
		background-color: rgba(var(--v-theme-primary), 0.1);
	}

	&__left ,
	&__right {
		width: 50%;
	}

	&__right {
		display: flex;
		align-items: center;

		& p {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&__left {
		display: flex;
		align-items: center;

		& .form-date {
			width: 90%;
		}
	}
}
</style>