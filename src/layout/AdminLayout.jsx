import { NavLink, Outlet, useNavigate } from "react-router"
import { logoutApi, setAuthToken } from "../utils/api"
import useMessage from "../hooks/useMessage";
function AdminLayout() {
  const {showSuccess, showError} = useMessage();
  const navigate = useNavigate()
  const handleLogout = async(e) =>{
    e.preventDefault();   //攔截 NavLink 的預設跳轉，由程式碼控制
    try {
      await logoutApi();
      document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/week7-reactTask;";    //清除cookie
      setAuthToken();   //清除 Axios Header記憶體狀態
      navigate('/login');
      showSuccess('已成功登出');
    } catch (error) {
      showError(error.response.data.message);
    }
  }
  return (
    <>
      <header className="bg-warning-subtle">
        <div className="container ">
          <ul className="nav justify-content-between fw-bold py-3 fs-5">
            <div className="d-flex">
              <li className="nav-item">
                <NavLink className={({isActive}) => { return isActive ? "nav-link text-primary fw-bold" : "nav-link text-success fw-bold"}} to="/admin/product">後台商品列表</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive}) => { return isActive ? "nav-link text-primary fw-bold" : "nav-link text-success fw-bold"}} to="/admin/order">後台訂單列表</NavLink>
              </li>              
            </div>
            <div>
              <li className="nav-item">
                <NavLink className={({isActive}) => { return isActive ? "nav-link text-primary fw-bold" : "nav-link text-success fw-bold"}} to="/login" onClick={handleLogout}>登出</NavLink>
              </li>              
            </div>
          </ul>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="text-center bg-warning-subtle py-3">© 2026 六角學院. All rights reserved.</footer>
    </>
  )
}
export default AdminLayout