<template>
	<div class="form-column-list">
		<template
			v-for="item in items"
			:key="item.id"
		>
			<slot :item="item"></slot>
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
.form-column-list {
	display: flex;
	flex-direction: column;

	& > *:not(:first-child) {
		margin-top: 12px;
	}
}
</style>