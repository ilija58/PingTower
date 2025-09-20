import styles from './ResponseTimeChart.module.scss';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Эти данные и лейблы вам нужно будет заменить на реальные данные из вашего API
const labels = ['01:38', '03:14', '04:58', '06:42', '08:26', '10:02', '11:38', '13:14', '14:50', '16:26'];

export const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
      label: 'Базовое время',
      data: labels.map(() => Math.random() * 400 + 100),
      backgroundColor: 'rgba(138, 99, 255, 0.7)', // Фиолетовый
      borderColor: 'rgba(138, 99, 255, 1)',
      borderWidth: 1,
      borderRadius: 2,
      barPercentage: 1.0,
      categoryPercentage: 1.0,
    },
    {
      label: 'Пиковое время',
      data: labels.map(() => Math.random() * 1200 + 400),
      backgroundColor: 'rgba(102, 225, 178, 0.7)', // Зеленый
      borderColor: 'rgba(102, 225, 178, 1)',
      borderWidth: 1,
      borderRadius: 2,
      barPercentage: 0.4,
      categoryPercentage: 0.6,
    },
  ],
};

export const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      beginAtZero: true,
      stacked: true,
      ticks: {
        callback: function(value) {
          const numericValue = Number(value);
          if (numericValue >= 1000) {
            return numericValue / 1000 + 'с';
          }
          return numericValue + ' мс';
        }
      }
    }
  }
};

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
  );
}
