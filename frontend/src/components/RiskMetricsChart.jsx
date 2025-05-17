import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RiskMetricsChart({ progress = 0, done = 0, todo = 0 }) {
  const data = {
    labels: ["In Progress", "Done", "To Do"],
    datasets: [
      {
        label: "Risks",
        data: [progress, done, todo],
        backgroundColor: "#FF3380",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
