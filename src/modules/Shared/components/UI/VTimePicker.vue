<template>
	<vue-timepicker
		:format="format"
		:drop-direction="dropDirection"
		:key="refreshKey"
		:model-value="value"
		@update:model-value="onTimeChange"
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

		const sanitazeValue = (value) => {
			if (value < 10) {
				return `0${value}`;
			}

			return value;
		}

		const parseObjectFromMilliseconds = (milliseconds) => {
			const time = {};

			time.HH = sanitazeValue(Math.floor(milliseconds / (60 * 60 * 1000)));
			milliseconds -= time.HH * 60 * 60 * 1000;

			time.mm = sanitazeValue(Math.floor(milliseconds / (60 * 1000)));
			milliseconds -= time.mm * 60 * 1000;

			time.ss = sanitazeValue(Math.floor(milliseconds / 1000));
			milliseconds -= time.ss * 1000;

			return time;
		}

		const onTimeChange = (time) => {
			emit('update:modelValue', parseMillisecondsFromObject(time));
		}

		watch(() => props.modelValue, (val) => {
			value.value = parseObjectFromMilliseconds(val);
		}, { immediate: true });

		return {
			value,
			timepicker,
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