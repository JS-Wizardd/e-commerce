import { useEffect, useState } from 'react'
import { images } from '../../constants/images'

const Banner = () => {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        setIndex((prevIndex) =>
          prevIndex < images.length - 1 ? prevIndex + 1 : 0
        )
        setFade(false)
      }, 400)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full   relative overflow-hidden">
      <img
        className={`min-w-full  object-cover transition-all duration-1000 object-center bg-repeat-x ${
          fade ? 'opacity-0' : 'opacity-100'
        }`}
        src={images[index]}
        alt=""
      />
    </div>
  )
}
export default Banner
