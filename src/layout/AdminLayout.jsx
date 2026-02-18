import { NavLink, Outlet } from "react-router"
function AdminLayout() {
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