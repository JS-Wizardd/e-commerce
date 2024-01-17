import { useNavigate } from 'react-router-dom'

const LoginToContinue = ({ setLoginModal }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div
        className="absolute right-10 top-5"
        onClick={() => setLoginModal(false)}
      >
        <img src="../../../assets/icons/modal-close.png" alt="" />
      </div>
      <div className="w-2/5 max-sm:w-4/5 h-44 r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="h-3/4 text-start flex justify-start items-center">
          <p className="text-lg flex font-medium">Login to continue</p>
        </div>
        <div className="h-1/4 flex gap-x-2 w-full ">
          <button
            className={`border border-secondary w-2/4 bg-violet-100 flex items-center justify-center py-3 rounded hover:bg-secondary hover:text-white font-semibold active:scale-95 hover:shadow transition-all `}
            onClick={() => navigate('/login')}
          >
            login
          </button>
          <button
            className="border active:scale-95 border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => {
              setLoginModal(false)
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default LoginToContinue
