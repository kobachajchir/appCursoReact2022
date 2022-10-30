import { useEffect, useState } from "react";
import { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { CartContext } from "../context/CartContext";

export default function CartItemActions({ product, quantity }) {
  const { cart, removeItem, changeQuantity } = useContext(CartContext);
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const handleMinusOne = () => {
    if (itemQuantity > 1) {
      changeQuantity(product.id, itemQuantity - 1);
      setItemQuantity(itemQuantity - 1);
    }
  };
  const handlePlusOne = () => {
    if (itemQuantity < product.stock) {
      changeQuantity(product.id, itemQuantity + 1);
      setItemQuantity(itemQuantity + 1);
    }
  };
  return (
    <>
      <Col className="align-self-center" xs={"auto"}>
        <button className="btn btn-primary" onClick={handleMinusOne}>
          -
        </button>
        <span className="mx-2">{itemQuantity}</span>
        <button className="btn btn-primary" onClick={handlePlusOne}>
          +
        </button>
      </Col>
      <Col className="align-self-center" xs={"auto"}>
        <button
          className="btn btn-danger"
          onClick={() => removeItem(product.id)}
        >
          Remove
        </button>
      </Col>
    </>
  );
}
