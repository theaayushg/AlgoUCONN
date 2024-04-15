// import React, { useEffect, useRef } from 'react';
// import { Chart, registerables } from 'chart.js';
// import Papa from 'papaparse'; // Library for parsing CSV data
// import "../styles/StockGraphs.css"

// const DefaultGraph = ({ selectedStock }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Construct URL based on the selected stock
//         const response = await fetch(`./src/assets/csv/${selectedStock}_stock_data.csv`);
//         const csvData = await response.text(); // Get CSV data as text
//         const parsedData = Papa.parse(csvData, {
//           header: true,
//           skipEmptyLines: true, // Skip empty lines
//           transform: (value, header) => {
//             // Convert 'Close' values to numbers
//             if (header === 'Close') {
//               return Number(value);
//             }
//             return value;
//           }
//         }).data;
//         const dates = parsedData.map(item => item.Date);
//         const closePrices = parsedData.map(item => parseFloat(item.Close));

//         if (chartRef.current) {
//           chartRef.current.data.labels = dates;
//           chartRef.current.data.datasets[0].data = closePrices;
//           chartRef.current.update();
//         } else {
//           Chart.register(...registerables);
//           const ctx = document.getElementById('chart').getContext('2d');
//           chartRef.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//               labels: dates,
//               datasets: [{
//                 label: 'Close Price',
//                 data: closePrices,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 tension: 0.1
//               }]
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching or parsing data:', error);
//       }
//     };

//     fetchData();

//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//         chartRef.current = null;
//       }
//     };
//   }, [selectedStock]);

//   return (
//     <div className="graph-container">
//       <canvas id="chart" className='graph' />
//     </div>
//   );
// };

// const StockGraphs = ({ selectedStock }) => {
//   return (
//     <div className="StockGraph-container">
//       <h1>Stock Graphs</h1>
//       <div className='StockGraph-graph'>
//         <DefaultGraph selectedStock={selectedStock} />
//       </div>
//     </div>
//   );
// };

// export default StockGraphs;


import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import "../styles/StockGraphs.css"

const DefaultGraph = ({ selectedStock }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct URL based on the selected stock
        const response = await fetch(`./src/assets/csv/${selectedStock}_stock_data.csv`);
        const csvData = await response.text(); // Get CSV data as text
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true, // Skip empty lines
          transform: (value, header) => {
            // Convert 'Close' values to numbers
            if (header === 'Close') {
              return Number(value);
            }
            return value;
          }
        }).data;
        const dates = parsedData.map(item => item.Date);
        const closePrices = parsedData.map(item => parseFloat(item.Close));

        if (chartRef.current) {
          chartRef.current.data.labels = dates;
          chartRef.current.data.datasets[0].data = closePrices;
          chartRef.current.update();
        } else {
          Chart.register(...registerables);
          const ctx = document.getElementById('chart').getContext('2d');
          chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: dates,
              datasets: [{
                label: 'Close Price',
                data: closePrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
              }]
            }
          });
        }
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selectedStock]);

  return (
    <div className="graph-container">
      <canvas id="chart" className='graph' />
    </div>
  );
};

const StockGraphs = () => {
  const [selectedStock, setSelectedStock] = useState('');
  
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];

  return (
    <div className="StockGraph-container">
      <h1>Stock Graphs</h1>
      <div>
        <label htmlFor="stock-select">Select a stock:</label>
        <select id="stock-select" value={selectedStock} onChange={handleStockChange}>
          <option value="">Select...</option>
          {stocksList.map(stock => (
            <option key={stock} value={stock}>{stock}</option>
          ))}
        </select>
      </div>
      <div className='StockGraph-graph'>
        <DefaultGraph selectedStock={selectedStock} />
      </div>
    </div>
  );
};

export default StockGraphs;
