import axios from 'axios'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

const SalesPerModel = () => {
  const [productStats, setProductStats] = useState([])

  const productChartRef = useRef(null)

  const fetchSalesPerModel = async () => {
    try {
      const { data } = await axios.get('/admin/stats/sales-per-model')
      if (data.success) {
        setProductStats(data.salesPerModal)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let myChart
    if (productChartRef.current) {
      const ctx = productChartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: productStats.map((stat) => stat.productName),
          datasets: [
            {
              label: 'Sales per Model',
              data: productStats.map((stat) => stat.totalQuantity),
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // customize as needed
              borderColor: 'rgba(255, 99, 132, 1)', // customize as needed
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
  }, [productChartRef, productStats])

  useEffect(() => {
    fetchSalesPerModel()
  }, [])

  return <canvas ref={productChartRef} className="" />
}

export default SalesPerModel
