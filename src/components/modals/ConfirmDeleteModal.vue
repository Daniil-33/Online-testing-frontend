<template>
	<v-dialog
        v-model="modelValue"
        activator="parent"
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
				@click="cancel"
			>
				Cancel
			</v-btn>

            <v-btn
				color="error"
				@click="confirm"
			>
				Confirm
			</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>
<script>
export default {
	props: {
		payload: {
			type: Object,
			default: () => ({}),
		},
		modelValue: {
			type: Boolean,
			default: () => false,
		}
	},
	emits: [
		'update:modelValue',
		'confirm'
	],
	setup(props, { emit }) {
		const cancel = () => {
			emit('update:modelValue', false)
		}

		const confirm = () => {
			emit('confirm', props.payload)
		}

		return {
			cancel,
			confirm,
		}
	}
}
</script>