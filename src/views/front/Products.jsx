import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Products() {
  const [products, setProducts] = useState([]);
  //react router切換頁面使用navigate
  const navigate = useNavigate();

  //一進到畫面就會做的事情，使用useEffect
  useEffect(() => {
    const getProducts = async()=>{
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        //console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        alert(error.response.data.message);
      }
    }
    getProducts();
  }, []);
  const handleView = async(id) => {
    navigate(`/product/${id}`);   //切頁面可用Link或navigate
    // try {
    //   const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
    //   console.log(response);
    //   //取得API後切換頁面
    //   navigate(`/product/${id}`, {
    //     state: {
    //       productData: response.data.product
    //     }
    //   })
    // } catch (error) {
    //   alert(error.response.data.message);
    // }
  }
  return(
    <div className="container my-4">
      <div className="row">
        {products.map((product) => {
          return (
            <div className="col-4 mb-4" key={product.id}>
              <div className="card w-100 h-100">
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
                      <button type="button" className="btn btn-primary" onClick={()=>handleView(product.id)}>查看更多</button>
                    </div>
                  </div>                  
                                    
                </div>
              </div>  
            </div>            
          )
        })}

      </div>
    </div>

  )
}
export default Products