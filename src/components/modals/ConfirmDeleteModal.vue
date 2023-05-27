<template>
	<v-dialog
        v-model="isActive"
        width="400"
      >
        <v-card>
          <v-card-text>
            <h4 class="text-center">{{ payload.title }}</h4>
			<p class="text-center">{{ payload.text }}</p>
          </v-card-text>
          <v-card-actions>
			<v-spacer></v-spacer>

            <v-btn
				@click="onReject"
			>
				Відміна
			</v-btn>

            <v-btn
				color="error"
				:loading="loading"
				:disabled="loading"
				@click="onResolve"
			>
				Видалити
			</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>
<script>
import { ref } from 'vue'
export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
	},
	expose: ['requestConfirmation', 'closeModal'],
	setup() {
		const payload = ref({})
		const isActive = ref(false)
		const onResolve = ref(null)
		const onReject = ref(null)

		const requestConfirmation = (payloadData) => {
			payload.value = payloadData || {}
			isActive.value = true;

			return new Promise((resolve) => {
				onResolve.value = () => resolve(true)
				onReject.value = () => resolve(false)
			})
		}

		const closeModal = () => {
			isActive.value = false
		}

		return {
			payload,
			isActive,
			onResolve,
			onReject,

			requestConfirmation,
			closeModal,

		}
	}
}
</script>