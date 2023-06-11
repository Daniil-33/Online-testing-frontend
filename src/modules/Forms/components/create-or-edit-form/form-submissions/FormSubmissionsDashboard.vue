<template>
	<div
		v-if="isLoading"
		class=""
	>
		<div class="d-flex align-center h-100 w-100 justify-center">
			<v-progress-circular
				indeterminate
				color="primary"
			></v-progress-circular>
		</div>
	</div>
	<div v-else-if="isLoadingCrashed">
		<p class="text-h4 text-center">Щось пішло не так...</p>
	</div>
	<div v-else-if="formSubmissionsAnalytic.submissions.length">
		<div class="submissions-dashboard">
			<div class="submissions-dashboard__charts-widgets px-3 py-3 mt-3 rounded">
				<v-card class="px-2 py-1 mr-2">
					<p class="text-h6">Кількість результатів: </p>
					<p class="text-muted">{{ form.submissions.length }}</p>
				</v-card>
				<v-card class="px-2 py-1 mr-2">
					<p class="text-h6">Найнижча оцінка: </p>
					<p class="text-muted">{{ formSubmissionsAnalytic.minSubmissionPoints }} балів</p>
				</v-card>
				<v-card class="px-2 py-1 mr-2">
					<p class="text-h6">Середня оцінка: </p>
					<p class="text-muted">{{ formSubmissionsAnalytic.averagePoints }} балів</p>
				</v-card>
				<v-card class="px-2 py-1">
					<p class="text-h6">Найвища оцінка: </p>
					<p class="text-muted">{{ formSubmissionsAnalytic.maxSubmissionPoints }} балів</p>
				</v-card>
			</div>

			<div class="submissions-dashboard__charts px-3 py-3 mt-3 rounded">
				<div class="submissions-dashboard__charts-line">
					<v-card class="w-100 h-100 px-1 py-1">
						<canvas ref="lineChart"></canvas>
					</v-card>
				</div>
				<div class="submissions-dashboard__charts-vertical">
					<div class="submissions-dashboard__charts-pie">
						<v-card class="w-100 h-100 px-1 py-1">
							<canvas ref="pieChart"></canvas>
						</v-card>
					</div>
					<div class="submissions-dashboard__charts-bars">
						<v-card class="w-100 h-100 px-1 py-1">
							<canvas ref="barChart"></canvas>
						</v-card>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		v-else
		class="mt-3"
	>
		<p class="text-h4 text-center">Недостатньо данних<br />Форма ще не має результатів</p>
	</div>
</template>
<script>
import Chart from 'chart.js/auto';
import useForm from '@/modules/Forms/composables/data/useForm';

import { range, safeAsyncCall } from '@/helpers/utilsHelper'

import { ref, computed, nextTick } from 'vue';
export default {
	name: 'FormSubmissionsDashboard',
	props: {
		form: {
			type: Object,
			default: () => ({})
		},
	},
	setup(props) {
		const lineChart = ref(null);
		const pieChart = ref(null);
		const barChart = ref(null);

		const {
			loadingFlags,
			formSubmissionsAnalytic,
			getFormSubmissionsAnalytic,
		} = useForm()

		const isLoading = computed(() => loadingFlags.getFormSubmissionsAnalytic)
		const lineChartData = computed(() => {
			if (!formSubmissionsAnalytic.value) {
				return {
					xValues: [],
					yValues: []
				}
			}

			const xValues = range(Math.max(formSubmissionsAnalytic.value.maxFormPoints, formSubmissionsAnalytic.value.maxSubmissionPoints) + 1 || 0)
			const yValues = xValues.map(pointValue => {
				const submissionsWithSuchPointsLevel = formSubmissionsAnalytic.value.submissions.filter(submission => submission.aggregatedPoints === pointValue)
				return submissionsWithSuchPointsLevel.length
			})

			return {
				xValues,
				yValues
			}
		})
		const pieChartData = computed(() => {
			if (!formSubmissionsAnalytic.value) {
				return {
					xValues: [],
					yValues: []
				}
			}

			const xValues = [`Перевірено робіт із ${formSubmissionsAnalytic.value.submissions.length}`, `НЕ перевірено робіт із ${formSubmissionsAnalytic.value.submissions.length}`]
			const yValues = [formSubmissionsAnalytic.value.checkedCount, formSubmissionsAnalytic.value.uncheckedCount]

			return {
				xValues,
				yValues
			}
		})
		const barChartData = computed(() => {
			if (!formSubmissionsAnalytic.value) {
				return {
					xValues: [],
					yValues: []
				}
			}

			const xValues = [
				'Мінімальний бал серед респондентів',
				'Середній бал серед респондентів',
				'Максимальний бал серед респондентів',
				'Максимально можливий бал'
			]
			const yValues = [
				formSubmissionsAnalytic.value.minSubmissionPoints,
				formSubmissionsAnalytic.value.averagePoints,
				formSubmissionsAnalytic.value.maxSubmissionPoints,
				formSubmissionsAnalytic.value.maxFormPoints
			]

			return {
				xValues,
				yValues
			}
		})

		const renderLineChartByPoints = (canvas, xValues, yValues) => {
			if (!canvas) return;

			const ctx = canvas.getContext('2d');

			new Chart(ctx, {
				type: "line",
				data: {
					labels: xValues,
					datasets: [{
						label: '',
						data: yValues,
						fill: false,
						borderColor: '#2979ff',
						tension: 0.3
					}]
				},
				options: {
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							intersect: false,
							displayColors: false,
							callbacks: {
								title: ([{ parsed }]) => {
									return `${parsed.y} респондентів отримали оцінку ${parsed.x}`
								},
								label: () => ''
							}
						},
						responsive: true,
						title: {
							display: true,
							text: 'Динаміка оцінок',
						},
					},
					scales: {
						y: {
							ticks: {
								callback: function(value, index, ticks) {
									if (value % 1 === 0) {
										return value
									}

									return ''
								}
							}
						}
					}
				}
			});
		}

		const renderPieChartByChecks = (canvas, xValues, yValues) => {
			if (!canvas) return;

			const ctx = canvas.getContext('2d');

			new Chart(ctx, {
				type: "doughnut",
				data: {
					labels: xValues,
					datasets: [{
						backgroundColor: ["#00E676","#FF1744"],
						data: yValues
					}]
				},
				options: {
					plugins: {
						legend: {
							display: false
						},
						responsive: true,
						title: {
							display: true,
							text: 'Перевірено/Не перевірено',
						},
					},
				}
			});
		}

		const renderBarChartByAveragePoints = (canvas, xValues, yValues) => {
			if (!canvas) return;

			const ctx = canvas.getContext('2d');

			new Chart(ctx, {
				type: "bar",
				data: {
					labels: xValues,
					datasets: [{
					backgroundColor: ["#FF1744", "#FFEA00", '#00E676', '#2979ff'],
					data: yValues
					}]
				},
				options: {
					plugins: {
						legend: {
							display: false
						},
						responsive: true,
						title: {
							display: true,
							text: 'Статистика по оцінкам',
						}
					},
					scales: {
						x: {
							display: false
						}
					}
				}
			});
		}

		const isLoadingCrashed = ref(false)
		const loadData = async () => {
			isLoadingCrashed.value = false;
			const [error, result] = await safeAsyncCall(getFormSubmissionsAnalytic(props.form._id))

			if (error) {
				isLoadingCrashed.value = true
			}

			nextTick(() => setTimeout(() => {
				renderLineChartByPoints(lineChart.value,lineChartData.value.xValues, lineChartData.value.yValues)
				renderPieChartByChecks(pieChart.value, pieChartData.value.xValues, pieChartData.value.yValues)
				renderBarChartByAveragePoints(barChart.value, barChartData.value.xValues, barChartData.value.yValues)
			}, 100))
		}

		loadData()

		return {
			isLoading,
			lineChart,
			pieChart,
			barChart,

			isLoadingCrashed,
			formSubmissionsAnalytic,
		}
	}
}
</script>
<style lang="scss">
.submissions-dashboard {
	&__charts-widgets,
	&__charts {
		background-color: rgba(235, 235, 235, 1);
	}

	&__charts-widgets {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	}

	&__charts {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 400px;
		width: 100%;

		&-line {
			width: 60%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 5px;

			& canvas {
				width: 100% !important;
				height: 100% !important;
			}
		}

		&-vertical {
			width: 40%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding-left: 5px;
		}

		&-pie {
			width: 100%;
			height: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 5px;
		}

		&-bars {
			width: 100%;
			height: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-top: 5px;
		}

		& canvas {
			margin: 0 auto;
    		display: block;
		}
	}
}
</style>