import Order from '../Models/ordersModel.js'
import User from '../Models/userModel.js'

// sales per category
const generateCategoryStats = async () => {
  try {
    const categoryStats = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          category: { $arrayElemAt: ['$productDetails.category', 0] },
          productName: { $arrayElemAt: ['$productDetails.name', 0] }, // Include product name if needed
        },
      },
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$totalQuantity' },
          products: {
            $push: {
              productName: '$productName',
              quantitySold: '$totalQuantity',
            },
          },
        },
      },
      {
        $sort: { totalQuantity: -1 }, // Sort by totalQuantity, if needed
      },
    ])

    return categoryStats
  } catch (error) {
    console.error('Error generating category stats:', error)
    throw error
  }
}

// income per day
const generateIncomePerDayStats = async () => {
  try {
    const incomeStats = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalIncome: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ])

    return incomeStats
  } catch (error) {
    console.error('Error generating income per day stats:', error)
    throw error
  }
}

// new users per week stats
const newUsersPerDayStats = async () => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ])

    return userStats
  } catch (error) {
    console.error('Error generating new users per day stats:', error)
    throw error
  }
}

// top 5 sold products
const generateSalesPerModelStats = async () => {
  try {
    const productStats = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          productName: { $arrayElemAt: ['$productDetails.name', 0] },
        },
      },
      {
        $sort: { totalQuantity: -1 }, // Sort by totalQuantity
      },
      {
        $limit: 5, // Limit to top 5
      },
    ])

    return productStats
  } catch (error) {
    console.error('Error generating sales per model stats:', error)
    throw error
  }
}

export {
  generateCategoryStats,
  generateIncomePerDayStats,
  newUsersPerDayStats,
  generateSalesPerModelStats,
}
