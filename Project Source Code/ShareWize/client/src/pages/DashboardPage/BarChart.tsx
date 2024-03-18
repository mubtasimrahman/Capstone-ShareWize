import { BarChart } from '@mui/x-charts/BarChart';




const dailyData = [
    100, 200, 150, 300, 250, 400, 350, 200, 300, 250, 150, 200,
    300, 400, 350, 250, 200, 300, 400, 350, 200, 250, 150, 300,
    400, 350, 250, 200, 300, 400 
  ];

  // We can populate the data with info on the monthly spending. So the y axis shows amount spent and then the x axis shows the dates or something


  
  // Array of labels for each day of the month
  const dayLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);
  
  export default function SimpleBarChart() {
    return (
      <BarChart
        width={800} // Adjust width as needed
        height={400} // Adjust height as needed
        series={[
          { data: dailyData, label: 'Total Spend', id: 'totalSpend' },
        ]}
        xAxis={[{ data: dayLabels, scaleType: 'band' }]}
        yAxis={[{ scaleType: 'linear' }]} // Use linear scale for total spend
      />
    );
  }