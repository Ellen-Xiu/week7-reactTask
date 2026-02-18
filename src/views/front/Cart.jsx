import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { currency } from "../../utils/filter";
import Swal from "sweetalert2";
import { Link } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart({isCheckout=false}) {
  const [cart, setCart] = useState([]);
  const [qtyInput, setQtyInput] = useState({});
  const debounceRef = useRef({});
  const handleQtyChange = (cartId, productId, value) => {
    setQtyInput(prev => ({ ...prev, [cartId]: value }));

    if (debounceRef.current[cartId]) {
      clearTimeout(debounceRef.current[cartId]);
    }

    debounceRef.current[cartId] = setTimeout(() => {
      updateCart(cartId, productId, value);
    }, 500);
  };
  const toastShow = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,       
  })
  //取得購物車資料
  const getCart = async() =>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      alert(error.response.data.message);
    }
  }  
  useEffect(()=> {
    (async() => await getCart())();
  },[])
  //更新購物車內容
  const updateCart = async(cartId, productId, qty=1) => {
    try {
      //準備傳入cart api資料
      const data = {
        product_id: productId,
        qty
      }
      const response = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {data});
      //console.log(response.data);
      //修改後要更新小計跟總計價錢，需呼叫取得購物車的方法
      getCart();
    } catch (error) {
      alert(error.response.data.message);
    }
  }
  //刪除購物車
  const delCart = async(cartId) => {
    const confirmResult = await Swal.fire({
      text: '確定要刪除該品項',
      color: '#ff0000',
      icon: 'warning',
      confirmButtonText: '確定刪除',
      showCancelButton: true,
      cancelButtonText: '取消'
    })
    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);      
        //alert(`商品${response.data.message}`);
        //修改後要更新小計跟總計價錢，需呼叫取得購物車的方法
        toastShow.fire({
          icon: 'success',
          text: '已刪除該品項',
        })
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
    }

  }
  //清空購物車
  const delAllCart = async() => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      //alert('已清空購物車');
      toastShow.fire({
        icon: 'success',
        text: '已清空購物車',
      })
      getCart();
    } catch (error) {
      alert(error.response.data.message);
    }
  }    

  return(
    <div className="container my-4">
      <h2 className="text-center">購物車列表</h2>
      {cart?.carts?.length === 0 ? (
      <h4 className="text-center text-danger fw-bold">尚未購買商品，請至商品列表選購</h4>): (
        <>
          <div className="text-end mt-4 mb-4">
            <button type="button" className="btn btn-danger" onClick={()=>{delAllCart()}}>
              清空購物車
            </button>
          </div>        
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">品名</th>
                <th scope="col">售價</th>
                <th scope="col">數量/單位</th>
                <th scope="col" className="text-end">小計</th>
              </tr>
            </thead>
            <tbody>
              {cart?.carts?.map((cartItem)=>{
                return (
                  <tr key={cartItem.id}>
                    <td>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => delCart(cartItem.id)}>
                        刪除
                      </button>
                    </td>
                    <th scope="row">
                      {cartItem.product.title}
                    </th>
                    <td>{cartItem.product.price}</td>
                    <td>
                      <div className="input-group input-group-sm mb-3">
                        <input 
                          type="number"
                          className="form-control"
                          aria-label="Sizing example input"
                          aria-describedby="inputGroup-sizing-sm"
                          defaultValue={cartItem.qty}
                          onChange={(e) => 
                            handleQtyChange(cartItem.id, 
                            cartItem.product.id, 
                            Number(e.target.value)  //因input輸入為字串需轉換為數字
                            )
                          }
                          min="1"
                        />
                        <span className="input-group-text" id="inputGroup-sizing-sm">{cartItem.product.unit}</span>
                      </div>                  
                    </td>
                    <td className="text-end">
                      {currency(cartItem.final_total)}
                    </td>
                  </tr>              
                )
              })}         
            </tbody>
            <tfoot>
              <tr>
                <td className="text-end" colSpan="4">
                  總計
                </td>
                <td className="text-end">{currency(cart.final_total)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="text-end">
            {!isCheckout && <Link type="button" className="btn btn-primary" to='/checkout'>前往結帳</Link>}
          </div>                  
        </>
      )}      
    </div>
  )
}
export default Cart