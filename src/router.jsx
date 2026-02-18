import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Cart from "./views/front/Cart"
import NotFound from "./views/front/NotFound";
import Checkout from "./views/front/Checkout";
import Login from "./views/Login"
import ProductList from "./views/productList";
import AdminLayout from "./layout/AdminLayout";
import AdminProducts from "./views/admin/AdminProducts";
import AdminOrders from "./views/admin/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";


const routers = [
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'product',
        element: <Products />
      },
      {
        path: 'product/:id',  //產品詳情需取得id，寫法:id
        element: <SingleProduct />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'login',
        element: <Login />
      }         
    ]
  },
  {
    path: '/admin',
    element: 
      <ProtectedRoute>
        <AdminLayout /> {/*ProtectedRoute的children指的是AdminLayout的內容 */}
      </ProtectedRoute>,
    children: [
      {
        path: 'product',
        element: <AdminProducts />
      },
      {
        path: 'order',
        element: <AdminOrders />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  },
]

export const router = createHashRouter(routers);