import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import CartSkelton from '../components/skeltons/CartSkelton'
import WalletCard from '../components/WalletCard'

const WalletPage = () => {
  const [isWalletLoading, setIsWalletLoading] = useState(true)
  const [wallet, setWallet] = useState(0)
  const [history, setHistory] = useState([])

  const navigate = useNavigate()

  const fetchWallet = async () => {
    setIsWalletLoading(true)
    try {
      const { data } = await axios.get('/users/wallet')
      // console.log(data)
      if (data.success) {
        // console.log(data)
        setWallet(data.wallet.balance)
        setHistory(data.wallet.history)
        setTimeout(() => {
          setIsWalletLoading(false)
        }, 500)
      }
    } catch (error) {
      alert('something went wrong while fetching wallet')
      setIsWalletLoading(false)
    }
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  return (
    <div className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isWalletLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
            <button
              className="bg-secondary mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={() => navigate(-1)}
            >
              <img src="/go back.png" alt="go back" className="h-6" />
            </button>
            My Wallet
            <img
              src="../../assets/icons/purple cart.png"
              alt="cart icon"
              className="object-contain ml-2 h-9"
            />
          </div>
          {Array(4)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </>
      ) : (
        <>
          <div className="w-full  px-3 flex justify-center min-h-fit pb-10 gap-x-4 overflow-hidden">
            <div
              className={`sm:w-full ${
                !isWalletLoading && history?.length > 0 && 'sm:w-2/3'
              } w-full `}
            >
              <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex justify-between items-center text-violet-700 mb-5 pl-5">
                <div className="flex items-center">
                  <button
                    className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
                    onClick={() => navigate(-1)}
                  >
                    <img src="/go back.png" alt="go back" className="h-6" />
                  </button>
                  My Wallet
                  <img
                    src="../../assets/icons/wallet.png"
                    alt="cart icon "
                    className="object-contain ml-2 h-9"
                  />
                </div>
                <div className="flex gap-x-3 text-xl font-semibold items-center py-2 text-white bg-accent rounded-lg px-2 ">
                  <p>Bal:</p>
                  <p className="">{wallet?.toLocaleString('en-IN')}/-</p>
                </div>
              </div>

              {!isWalletLoading && history?.length > 0 ? (
                history.map((history, i) => (
                  <WalletCard history={history} key={i} />
                ))
              ) : (
                <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                  Wallet history is empty!
                  <Link
                    to={'/'}
                    className="underline text-violet-400 hover:text-violet-600"
                  >
                    continue shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default WalletPage
