import { useState, useEffect } from "react";
import { setAuthToken, checkLoginApi } from '../utils/api';
import { RotatingLines } from "react-loader-spinner";
import { Navigate } from "react-router";

//checkLogin相關內容移入ProtectedRoute元件
function ProtectedRoute({children}) {   //路由守衛通過檢查後才會顯示後台頁面
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);   //API回傳需要時間，故加入載入的樣式

  useEffect(() => {
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userToken="))
    ?.split("=")[1];
    //確定取得tokon後才將token放到header
    if(!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }else {
      setAuthToken(token);
      //處理登入驗證
      const checkLogin = async() => {
        try {
          await checkLoginApi();
          //console.log(response);
          //驗證成功後要做的事:畫面狀態改為登入、取得產品
          setIsAuth(true);
        } catch (error) {
          //console.log(error);
          alert(`登入失敗訊息:${error.response?.data.message}`);
        } finally {
          setLoading(false);
        }
      }
      checkLogin(); //呼叫函式驗證登入      
    }
  },[]);

  if(loading) return (
    <div className="d-flex justify-content-center">
      <RotatingLines />
    </div>
    
  );
  if (!isAuth) return <Navigate to="/login" />;
  return children;
}
export default ProtectedRoute;