import AccountCategory from '../components/AccountCategory'

const AccountPage = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-2 lg:gap-3 pt-3 px-5">
      <AccountCategory
        name="Profile"
        link="profile"
        src="../../assets/icons/profile.png"
      />
      <AccountCategory
        name="My Orders"
        link="orders"
        src="../../assets/icons/orders.png"
      />
      <AccountCategory
        name="My Wallet"
        link="wallet"
        src="../../assets/icons/wallet_white.png"
      />
    </div>
  )
}
export default AccountPage
