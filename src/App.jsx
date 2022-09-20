import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Navigationbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import ItemListContainer from "./components/ItemListContainer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Container fluid>
        <BrowserRouter>
          <Navigationbar />
          <Routes>
            <Route
              path="/"
              exact
              element={<ItemListContainer greeting="Hola Coders!" />}
            />
            <Route path="/products" exact element={null} />
            <Route path="/cart" exact element={null} />
          </Routes>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
