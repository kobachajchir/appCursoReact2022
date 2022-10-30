import { useEffect } from "react";
import { useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import { CartContext } from "../context/CartContext";
import "./../styles/ItemCount.css";
import ToCartButton from "./ToCartButton";

const iconSize = 20;

export function ItemCount({ product }) {
  const { cart, addItem, isInCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const handleMinusOne = () => {
    quantity > 1 && setQuantity(quantity - 1);
  };
  const handlePlusOne = () => {
    quantity < product.stock && setQuantity(quantity + 1);
  };
  useEffect(() => {
    if (isInCart(product.id)) {
      setAddedToCart(true);
    }
  }, [cart]);
  return (
    <div id={"itemCounter" + product.id}>
      {addedToCart == false ? (
        <>
          <Row className="input-group mb-3">
            <button className="quantityButton col-2" onClick={handleMinusOne}>
              <DashLg size={iconSize}></DashLg>
            </button>
            <label className="col-md-2 col-6 text-center form-control">
              {quantity}
            </label>
            <button className="quantityButton col-2" onClick={handlePlusOne}>
              <PlusLg size={iconSize}></PlusLg>
            </button>
          </Row>
          <div className="w-100"></div>
          <Row as={Col} xs={3} className="justify-content-center">
            <a
              className="btn btn-danger addToCart"
              onClick={() => {
                console.log("ADD TO CART " + product.code);
                addItem(product, quantity);
                setAddedToCart(true);
              }}
            >
              Agregar al carrito
            </a>
          </Row>
        </>
      ) : (
        <Row as={Col} xs={3} className="justify-content-center">
          <ToCartButton />
        </Row>
      )}
    </div>
  );
}
