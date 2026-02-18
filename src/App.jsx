import { RouterProvider } from "react-router";
import { router } from "./router";
import './assets/style.css'
import MessageToast from "./components/MessageToast";

function App() {
  return(
    <>      
      <MessageToast />  {/*因彈跳視窗每個地方都有，故放在app*/}
      <RouterProvider router={router} />
    </>
  )
}
export default App