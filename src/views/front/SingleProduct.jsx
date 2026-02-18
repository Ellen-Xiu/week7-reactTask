import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router"

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function SingleProduct() {
  //const location = useLocation();
  //const product = location.state?.productData;

  const { id } = useParams();   //使用useParams接navigate傳遞的參數
  const [product, setProduct] = useState();

  //進到頁面呼叫API取得產品，使用useEffect
  useEffect(() => {
    const handleView = async(id) => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        //console.log(response.data.product);
        //取得API後設定資料狀態
        setProduct(response.data.product);
      } catch (error) {
        alert(error.response.data.message);
      }
    }
    handleView(id); 
  },[id]);
  //加入購物車功能
  const addCart = async(id, qty=1) => { //設定預設數量為1
    try {
      //準備傳入的資料
      const data = {
        product_id: id,
        qty
      }
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {data});
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }
 
  return !(product) ? (
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>) : 
    (<div className="contaner my-4">      
      <div className="card mx-auto" style={{width: '300px'}}>
        <img src={product.imageUrl} className="card-img-top" alt="圖片" style={{height: '300px'}}/>
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center mb-3">
            <span className="btn btn-warning me-3">{product.category}</span>
            <h5 className="card-title mb-0">{product.title}</h5>
          </div>
          
          <p className="card-text">{product.description}</p>
          <div className="d-flex justify-content-between mt-auto">  
            <p>售價:NT${product.price}</p>
            <div>
              <button type="button" className="btn btn-primary" onClick={()=>addCart(product.id)}>加入購物車</button>
            </div>
          </div>                  
                            
        </div>
      </div>  
      
    </div>
  )
}
export default SingleProduct