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

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
