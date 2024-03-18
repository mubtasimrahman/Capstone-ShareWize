import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

// We can populate the data with info on the groups with the most expenses or something.
const data = [
  { id: 0, value: 10, label: 'Group 1' },
  { id: 1, value: 15, label: 'Group 2' },
  { id: 2, value: 20, label: 'Group 3' },
];

export default function PieActiveArc() {
  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
}
