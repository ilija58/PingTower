import { type ChartData } from 'chart.js'
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import styles from './ResponseTimeChart.module.scss'
import { options } from './chart.config'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ResponseTimeChartProps {
	data: ChartData<'bar'>
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span>HTTP, HEAD</span>
				<h4>Время отклика</h4>
			</div>
			<div className={styles.chartWrapper}>
				<Bar options={options} data={data} />
			</div>
		</div>
	)
}
