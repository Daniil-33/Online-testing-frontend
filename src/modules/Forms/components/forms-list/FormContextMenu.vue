<template>
	<v-list class="list-custom">
		<v-list-item
			active-color="primary"
			v-for="option in options"
			:key="option.title"
			@click="onListItemClick(option)"
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
<script>
import { useRouter } from 'vue-router'
export default {
	name: 'FormContextMenu',
	props: {
		id: {
			type: String,
			required: true,
		},
	},
	emits: ['delete'],
	setup(props, { emit }) {
		const options = [
			{
				title: 'Edit',
				icon: 'mdi-pencil',
				to: { name: 'Edit Form', params: { id: props.id } },
			},
			{
				title: 'Open in new tab',
				icon: 'mdi-open-in-new',
				to: { name: 'Submit Form', params: { id: props.id } },
			},
			{
				title: 'Delete',
				icon: 'mdi-trash-can-outline',
				action: () => emit('delete'),
			},
		]

		const router = useRouter()

		const onListItemClick = (item) => {
			if (item.to) {
				const routeData = router.resolve(item.to);
				window.open(routeData.href, '_blank');
			} else if (item.action) {
				item.action()
			}
		}

		return {
			options,
			onListItemClick
		}
	}
};
</script>
<style lang="scss">
.list-custom {
	& .v-list-item:hover {
		background-color: rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}
}
</style>