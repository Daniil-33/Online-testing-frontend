<template>
	<div
		class="form-row-card"
		@click="$router.push({ name: 'Edit Form', params: { id: form._id } })"
	>
		<div class="form-row-card__right">
			<v-icon color="primary" icon="mdi-format-list-bulleted"></v-icon>

			<p class="text-h6 ml-2">{{ form.title }}</p>
		</div>
		<div class="form-row-card__left">
			<p class="form-date text-muted">{{ formDate(form.createdOn) }}</p>

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

					<FormCardContextMenuList />
				</v-menu>
			</div>
		</div>
	</div>
</template>
<script>
import FormCardContextMenuList from './FormCardContextMenuList.vue';
export default {
	name: 'FormRowCard',
	components: {
		FormCardContextMenuList
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
	setup() {
		const formDate = (timeStamp) => {
			return new Date(timeStamp).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		}

		return {
			formDate
		}
	}
}
</script>
<style scoped lang="scss">
.form-row-card {
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