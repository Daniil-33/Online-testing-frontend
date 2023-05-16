<template>
	<vue-timepicker
		:format="format"
		:drop-direction="dropDirection"
		:model-value="value"
		@update:model-value="onTimeChange"
		@close="onClose"
	></vue-timepicker>
</template>
<script>
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'

import { watch, ref } from 'vue'

export default {
	props: {
		modelValue: {
			type: Number,
			default: 0,
		},
		dropDirection: {
			type: String,
			default: 'up',
		},
		format: {
			type: String,
			default: 'HH:mm:ss',
		}
	},
	components: {
		VueTimepicker,
	},
	emits: {
		'update:modelValue': null,
	},
	setup(props, { emit }) {
		const value = ref(props.modelValue);

		watch(() => props.modelValue, (val) => {
			value.value = parseObjectFromMilliseconds(val);
		});

		const parseMillisecondsFromObject = (time) => {
			let milliseconds = 0;

			if (time.HH) {
				milliseconds += parseInt(time.HH) * 60 * 60 * 1000;
			}

			if (time.mm) {
				milliseconds += parseInt(time.mm) * 60 * 1000;
			}

			if (time.ss) {
				milliseconds += parseInt(time.ss) * 1000;
			}

			return milliseconds;
		}

		const parseObjectFromMilliseconds = (milliseconds) => {
			const time = {};

			time.HH = Math.floor(milliseconds / (60 * 60 * 1000));
			milliseconds -= time.HH * 60 * 60 * 1000;

			time.mm = Math.floor(milliseconds / (60 * 1000));
			milliseconds -= time.mm * 60 * 1000;

			time.ss = Math.floor(milliseconds / 1000);
			milliseconds -= time.ss * 1000;

			return time;
		}

		const onTimeChange = (time) => {
			emit('update:modelValue', parseMillisecondsFromObject(time));
		}

		return {
			value,
			onTimeChange,
		}
	}
}
</script>
<style>
.vue__time-picker .dropdown ul li:not([disabled]).active,
.vue__time-picker .dropdown ul li:not([disabled]).active:focus,
.vue__time-picker .dropdown ul li:not([disabled]).active:hover {
	background: rgb(var(--v-theme-primary));
	color: #fff;
}

.vue__time-picker input.vue__time-picker-input {
	border-width: 0 0 1px 0;
	outline: none;
	caret-color: transparent;
	text-shadow: 0px 0px 1px #fff;
}

.vue__time-picker input.vue__time-picker-input:focus {
	border-width: 0 0 2px 0;
	border-color: rgb(var(--v-theme-primary));
}
</style>