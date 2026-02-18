import { useEffect } from "react";
import { useNavigate } from "react-router"

function NotFound() {
  const navegate = useNavigate();
  useEffect(() => {
    setTimeout(()=>{
      navegate('/');
    }, 1500)    
  },[navegate]);
  return (
    <h2 className="text-center">404 找不到頁面</h2>
  )
}
export default NotFound