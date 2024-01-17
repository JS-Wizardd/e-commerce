import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Chart from 'chart.js/auto'

const CategoryStats = () => {
  const [categoryStats, setCategoryStats] = useState([])
  const chartRef = useRef(null)

  const labels = categoryStats.map((stat) => stat._id)
  const data = categoryStats.map((stat) => stat.totalQuantity)

  const fetchSalesPerCategory = async () => {
    try {
      const { data } = await axios.get('/admin/stats/sales-per-category')
      if (data.success) {
        setCategoryStats(data.categoryStats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#AA6384', '#2CA21B']

  useEffect(() => {
    let myChart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Sales per Category',
              data: data,
              backgroundColor: colors, // Use the colors array here
              borderColor: 'rgba(75, 192, 192, 1)', // customize as needed
              borderWidth: 1, // customize as needed
            },
          ],
        },
        options: {
          responsive: true,
        },
      })
    }
    return () => {
      if (myChart) {
        myChart.destroy()
      }
    }
  }, [chartRef, labels, data])

  useEffect(() => {
    fetchSalesPerCategory()
  }, [])

  return <canvas ref={chartRef} className="w-full" />
}
export default CategoryStats
