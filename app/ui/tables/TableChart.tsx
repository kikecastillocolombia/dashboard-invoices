"use client"
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los elementos necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

interface TableStatus {
  label: string;
  count: number;
}

interface TableChartProps {
  tableStatusData: TableStatus[];
}

const TableChart: React.FC<TableChartProps> = ({ tableStatusData }) => {
  const data = {
    labels: tableStatusData.map(status => status.label),
    datasets: [
      {
        data: tableStatusData.map(status => status.count),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Estado</h2>
      <Pie data={data} />
    </div>
  );
};

export default TableChart;
