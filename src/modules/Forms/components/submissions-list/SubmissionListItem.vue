<template>
	<div
		class="submission-list-item"
		@click="$router.push({ name: 'Submission Review', params: { id: submission._id } })"
	>
		<div class="submission-list-item__right">
			<v-icon color="primary" icon="mdi-file-check-outline"></v-icon>

			<p class="text-h6 ml-2">{{ submission.formMetaData.title }}</p>
		</div>
		<div class="submission-list-item__left">
			<p class="form-date text-muted">{{ formatDate(submission.createdOn) }}</p>

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

					<SubmissionContextMenu
						:id="submission._id"
					/>
				</v-menu>
			</div>
		</div>
	</div>
</template>
<script>
import SubmissionContextMenu from './SubmissionContextMenu.vue';
import { formatDate } from '@/helpers/dateHelper'

export default {
	name: 'SubmissionListItem',
	components: {
		SubmissionContextMenu
	},
	props: {
		submission: {
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
	setup() {
		return {
			formatDate
		}
	}
}
</script>
<style scoped lang="scss">
.submission-list-item {
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