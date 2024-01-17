import axios from 'axios'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

const IncomeStats = () => {
  const [incomeStats, setIncomeStats] = useState([])

  const incomeChartRef = useRef(null)

  const fetchIncomePerDay = async () => {
    try {
      const { data } = await axios.get('/admin/stats/income-per-day')
      if (data.success) {
        setIncomeStats(data.incomeStats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let myChart
    if (incomeChartRef.current) {
      const ctx = incomeChartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: incomeStats.map((stat) => stat._id),
          datasets: [
            {
              label: 'Income per Day',
              data: incomeStats.map((stat) => stat.totalIncome),
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // customize as needed
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
  }, [incomeChartRef, incomeStats])
  useEffect(() => {
    fetchIncomePerDay()
  }, [])

  return <canvas ref={incomeChartRef} className="" />
}
export default IncomeStats
