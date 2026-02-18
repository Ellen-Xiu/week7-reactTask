import { Link } from "react-router"

function Home() {
  return(
    <div className="container my-5 text-center">
      <h2 className="mb-3">歡迎參觀本賣場商品</h2>
      <Link type="button" className="btn btn-primary text-center" to='/product'>前往商品列表</Link>
    </div>    
  )
}
export default Home