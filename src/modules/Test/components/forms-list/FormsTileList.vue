<template>
	<div class="form-tile-list">
		<template
			v-for="item in items"
			:key="item.id"
		>
			<div class="form-tile-list__item">
				<slot :item="item"></slot>
			</div>
		</template>
	</div>
</template>
<script>
export default {
	name: 'FormsColumnList',
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	setup() {

	}
}
</script>
<style scoped lang="scss">
.form-tile-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

	// &__item {}
}
</style>