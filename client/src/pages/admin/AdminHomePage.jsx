import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Chart from 'chart.js/auto'
import CategoryStats from '../../components/admin/dashboards/CategoryStats'
import IncomeStats from '../../components/admin/dashboards/IncomeStats'
import UserStats from '../../components/admin/dashboards/UserStats'
import SalesPerModel from '../../components/admin/dashboards/SalesPerModel'

const AdminHomePage = () => {
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

  return (
    <div className="p-2 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2  w-full   justify-center items-center gap-y-20 gap-x-14 ">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <IncomeStats />
          <h1 className="text-center mt-5 text-xl font-semibold">
            Income status
          </h1>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <CategoryStats />
          <h1 className="text-center mt-5 text-xl font-semibold">
            Sales Per Category
          </h1>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <UserStats />
          <h1 className="text-center mt-5 text-xl font-semibold">
            New Users Per Day
          </h1>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <SalesPerModel />
          <h1 className="text-center mt-5 text-xl font-semibold">
            Sales Per Model
          </h1>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage
