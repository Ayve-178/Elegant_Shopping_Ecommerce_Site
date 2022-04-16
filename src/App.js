import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./index.css";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductInfo from "./pages/ProductInfo";
import Registration from "./pages/Registration";
import "./stylesheets/Authentication.css";
import "./stylesheets/Layout.css";
import "./stylesheets/Products.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/cart" exact element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
            <Route path="/orders" exact element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
            <Route path="/admin" exact element={<AdminPanel><Admin /></AdminPanel>} />
            <Route
              path="/productInfo/:productId"
              exact
              element={<ProductInfo />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

export const ProtectedRoutes = ({children}) => {
  const {currentUser} = useAuth();
  if(currentUser) {
    return children;
  } else {
    return <Navigate to='/login' />
  }
}

export const AdminPanel = ({children}) => {
  const {currentUser} = useAuth();
  if(currentUser.uid === "6ICYPX82BLd4MtJrbT4lnpndKgo1") {
    return children;
  } else {
    return <Navigate to='/' />
  }
}
