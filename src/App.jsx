import { createContext, useState } from "react";
import "./App.css";
import Navigationbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Home from "./components/Home";
import Cart from "./components/Cart";
import User from "./components/User";
import NotFound from "./components/NotFound";
import CartProvider from "./providers/CartProvider";
import OrdersContainer from "./components/OrdersContainer";
import Order from "./components/Order";
import { initializeApp } from "firebase/app";
export const FirebaseConfigContext = createContext();
const firebaseConfig = {
  apiKey: "AIzaSyClyM0t39WQ8SI37pIZycGy2o02d57byxs",
  authDomain: "pachacreaciones3d.firebaseapp.com",
  projectId: "pachacreaciones3d",
  storageBucket: "pachacreaciones3d.appspot.com",
  messagingSenderId: "399612336262",
  appId: "1:399612336262:web:6ce144e7f2f050b6541907",
};
initializeApp(firebaseConfig);

function App() {
  return (
    <>
      <FirebaseConfigContext.Provider value={firebaseConfig}>
        <CartProvider>
          <BrowserRouter>
            <Navigationbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                exact
                path="/category/:idCat"
                element={<ItemListContainer />}
              />
              <Route exact path="/category/" element={<ItemListContainer />} />
              <Route
                exact
                path="/product/:idProd"
                element={<ItemDetailContainer />}
              />
              <Route exact path="/order/:idOrder" element={<Order />} />
              <Route exact path="/orders" element={<OrdersContainer />} />
              <Route exact path="/user/" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </FirebaseConfigContext.Provider>
    </>
  );
}

export default App;
