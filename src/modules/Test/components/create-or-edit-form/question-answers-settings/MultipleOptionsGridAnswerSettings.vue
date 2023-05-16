<template>
	<v-row>
		<v-col cols="10">
			<p class="text-h5" :class="{ 'text-disabled': !title }">
				{{ title || 'Question title' }}
			</p>
		</v-col>
		<v-col cols="2">
		</v-col>

		<v-col cols="12">
			<div class="options-grid">
				<div class="table-container">
					<table style="width: 100%">
						<thead>
							<tr>
								<th></th>
								<th
									v-for="col in cols"
									:key="col.id"
									@click="rightOptions[row.id] = col.id"
								>
									<div class="td-inner px-2">
										<p>{{ col.text }}</p>
									</div>
								</th>
								<th class="pinned-right" style="width: 120px"></th>
							</tr>
						</thead>
						<tbody>
							<template
								v-for="row in rows"
								:key="row.id"
							>
								<tr>
									<td>
										<div class="td-inner td-content py-1 px-1">
											{{ row.text }}
										</div>
									</td>

									<td
										v-for="col in cols"
										:key="col.id"
									>
										<div class="td-inner py-1 px-1 td-content">
											<v-checkbox
												class="answer-checkbox"
												v-model="rightOptions[row.id].id"
												label=""
												color="primary"
												:value="col.id"
												@update:model-value="updateOptions()"
											></v-checkbox>
										</div>
									</td>

									<td class="pinned-right">
										<div class="td-inner td-content py-1 px-1" style="width: 120px">
											<v-number-field
												label="Points"
												:model-value="rightOptions[row.id].points"
												@update:model-value="(rightOptions[row.id].points = $event, updateOptions())"
											>
											</v-number-field>
										</div>
									</td>
								</tr>
								<tr class="tr-placeholder">
									<td><div class="placeholder"></div></td>
									<td v-for="col in cols"><div class="placeholder"></div></td>
									<td><div class="placeholder"></div></td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>
			</div>
		</v-col>
	</v-row>
</template>
<script>
import { onMounted, computed, ref } from 'vue'

export default {
	name: 'MultipleOptionsGridAnswerSettings',
	props: {
		title: {
			type: String,
			default: '',
		},
		content: {
			type: Object,
			default: () => ({})
		},
		answerSettings: {
			type: Object,
			default: () => ({})
		}
	},
	emits: {
		'update:answer-settings': null,
	},
	setup(props, { emit }) {
		const cols = computed(() => props.content.cols)
		const rows = computed(() => props.content.rows)
		const rightOptions = ref(Object.fromEntries(rows.value.map((value) => [value.id, { id: [], points: 0 }])))
		const rightAnswers = computed(() => props.answerSettings || {})

		const updateOptions = () => {
			emit('update:answer-settings', rightOptions.value)
		}

		onMounted(() => {
			if (rightAnswers.value) {
				rightOptions.value = {
					...rightOptions.value,
					...rightAnswers.value,
				}
			}
		})

		return {
			cols,
			rows,
			updateOptions,
			rightOptions,
		}
	},
}
</script>
<style>
.answer-checkbox {
	max-width: 50px;
}
.answer-checkbox .v-input__details {
	display: none;
}
</style>