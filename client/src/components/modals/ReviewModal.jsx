import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setSidebarToggle } from '../../slices/sidebarSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Rate } from 'antd'

const ReviewModal = ({ productId, setReviewModal, fetchReviews }) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const addReview = async () => {
    setReviewModal()
    try {
      const { data } = await axios.post(`/reviews/add-review/${productId}`, {
        rating,
        review,
      })
      if (data.success) {
        fetchReviews()
      } else {
        alert('review add failed')
        setReviewModal()
        fetchReviews()
      }
    } catch (error) {
      console.error('Error adding review')
    }
  }

  return (
    <div
      className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="absolute right-10 top-5" onClick={setReviewModal()}>
        <img src="../../../assets/icons/modal-close.png" alt="" />
      </div>
      <div className="w-2/5 max-sm:w-4/5 h-fit  p-5 flex flex-col bg-slate-50 rounded-md">
        <div>
          <h1 className="text-xl mb-3 font-medium">Add review</h1>
        </div>
        <div className="my-2">
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
            className="scale-120"
          />
        </div>

        <div>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="resize-y"
          />
        </div>

        <button
          className="w-full mt-5 py-1 bg-secondary text-white text-lg rounded-lg active:scale-95 hover:shadow-lg font-semibold"
          onClick={addReview}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
export default ReviewModal
