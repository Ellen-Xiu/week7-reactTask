import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from 'bootstrap';
import SingleProductModal from "../../components/SingleProductModal";
import Cart from "./Cart";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingCardId, setLoadingCardId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);
  //formState為顯示錯誤訊息
  const { register, handleSubmit, formState: {errors}} = useForm({mode: "onChange"})

  //取得購物車資料
  const getCart = async() =>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      //console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      alert(error.response.data.message);
    }
  }
  const getProducts = async()=>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      console.log(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      alert(error.response.data.message);
    }
  }
  
  useEffect(()=> {
    (async() => await getProducts())();
    (async() => await getCart())();
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    })
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });       
  },[])

  //加入購物車功能
  const addCart = async(id, qty=1) => { //設定預設數量為1
    setLoadingCardId(id);   //按下按鈕時設定id
    try {
      //準備傳入的資料
      const data = {
        product_id: id,
        qty
      }
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {data});
      alert(response.data.message);
      //加入購物車與購物車清單為同一頁，故須取得購物車內容渲染畫面
      getCart();
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoadingCardId(null);   //取得API後要清空，但不建議放在try內，因為若api失敗，後續程式碼無法執行
    }
  }

  //處理訂單
  const onSubmit = async(formData) => {
    console.log(formData);
    try {
      //處理訂單格式符合api資料格式
      const data = {
        user: formData,
        message: formData.message
      }
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, {data});
      getCart();  //送出訂單後還要從新取得購物車狀態
    } catch (error) {
      alert(error.response.data.message);
    }    
  }

  const handleView = async(id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      //取得API後設定資料狀態
      setProduct(response.data.product);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoadingProductId(null);
    }
    //點擊查看更多會跳出modal
    productModalRef.current.show();
  }

  const closeModal = () => {
    productModalRef.current.hide();
  }

  return(
    <div className="container my-4">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => handleView(product.id)} disabled={loadingProductId === product.id}>
                    {loadingProductId === product.id ? (<RotatingLines color="green" width={80} height={16} />) : '查看更多'}                   
                  </button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => addCart(product.id)} disabled={loadingCardId === product.id}>
                    {loadingCardId === product.id ? (<RotatingLines color="green" width={80} height={16}/>) : '加到購物車'}
                    
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>      
      <Cart isCheckout={true}/>

      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'email格式不正確'
                }
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入姓名",
                minLength: {
                  value: 2,
                  message: "請輸入最少兩個字"
                }
              } )}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入電話",
                pattern: {
                  value: /^\d+$/,
                  message: "電話只能輸入數字"
                },
                minLength: {
                  value: 8,
                  message: "電話最少8碼"
                }
              })}
            />
            {errors.tel && (
              <p className="text-danger">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", {
                required: "請輸入地址"
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal product={product} addCart={addCart} closeModal={closeModal} />      
    </div>   
  )
}
export default Checkout