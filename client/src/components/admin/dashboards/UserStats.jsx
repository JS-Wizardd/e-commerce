import axios from 'axios'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

const UserStats = () => {
  const [userStats, setUserStats] = useState([])

  const userChartRef = useRef(null)

  const fetchUsersPerDay = async () => {
    try {
      const { data } = await axios.get('/admin/stats/users-per-day')
      // console.log(data)
      if (data.success) {
        setUserStats(data.userStats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let myChart
    if (userChartRef.current) {
      const ctx = userChartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: userStats.map((stat) => stat._id),
          datasets: [
            {
              label: 'New Users per Day',
              data: userStats.map((stat) => stat.count),
              backgroundColor: 'rgba(153, 102, 255, 0.2)', // customize as needed
              borderColor: 'rgba(153, 102, 255, 1)', // customize as needed
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
  }, [userChartRef, userStats])

  useEffect(() => {
    fetchUsersPerDay()
  }, [])

  return <canvas ref={userChartRef} className="max-w-fit" />
}
export default UserStats
