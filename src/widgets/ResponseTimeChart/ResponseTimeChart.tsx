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
import { data, options } from './chart.config'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ResponseTimeChart() {
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
