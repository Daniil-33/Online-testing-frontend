<template>
	<CreateOrEditForm
		:formId="formId"
	/>
</template>
<script>
import CreateOrEditForm from '../components/CreateOrEditForm.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
	name: 'EditFormView',
	components: {
		CreateOrEditForm
	},
	setup() {
		const route = useRoute();
		const formId = computed(() => {
			return route.params.id;
		});

		return {
			formId
		}
	}
}
</script>