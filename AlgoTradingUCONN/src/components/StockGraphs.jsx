import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import "../styles/StockGraphs.css"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import stockgraphicon from '../assets/stock-chart.svg';

const DefaultGraph = ({ selectStock, stockData, predict }) => {
  const chartRef = useRef(null);
  const [selectedStockClosePrice, setSelectedStockClosePrice] = useState(0);

  useEffect(() => {
    // Find the selected stock data in stockData
    const selectedStock = stockData.find(stock => stock.name === selectStock);

    if (selectedStock) {
      setSelectedStockClosePrice(selectedStock.c); // Extract the close price for the selected stock
    }
  }, [selectStock, stockData]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Construct URL based on the selected stock
      const response = await fetch(`./src/assets/csv/${selectStock}_stock_data.csv`);
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

      // Extracting data from the prediction

      const dates = parsedData.map(item => item.Date);
      const closePrices = parsedData.map(item => parseFloat(item.Close));

      // Prepare label array
      const labels = [...dates];
      // Add current date label
      labels.push(new Date().toISOString().split('T')[0]);
      // Add predicted date label if prediction is available
      if (predict) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        labels.push(tomorrow.toISOString().split('T')[0]);
      }

      if (chartRef.current) {
        chartRef.current.data.labels = labels;
        chartRef.current.data.datasets[0].data = [...closePrices, selectedStockClosePrice, predict];
        chartRef.current.update();
      } else {
        Chart.register(...registerables);
        const ctx = document.getElementById('chart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Close Price',
              data: [...closePrices, selectedStockClosePrice, predict],
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
}, [selectStock, stockData, predict, selectedStockClosePrice]);

  return (
    <div className="graph-container">
      <canvas id="chart" className='graph' />
      <div>Close Price for {selectStock}: {selectedStockClosePrice}</div>
    </div>
  );
};

export default DefaultGraph;
