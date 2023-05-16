<template>
	<Teleport
		v-if="parentSelector"
		:to="parentSelector"
	>
		<div
			class="global-progress"
			:class="customClass"
		>
			<v-progress-linear
				color="primary"
				height="5"
				:model-value="progress"
			></v-progress-linear>
		</div>
	</Teleport>

	<v-progress-linear
		v-else
		color="primary"
		height="5"
		:model-value="progress"
	></v-progress-linear>
</template>
<script>
export default {
	name: 'UiProgressBar',
	props: {
		parentSelector: {
			type: String,
			default: ''
		},
		progress: {
			type: Number,
			default: 0
		},
		customClass: {
			type: String,
			default: ''
		}
	}
}
</script>
<style scoped>
.global-progress {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
</style>