import { useEffect } from "react";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
export function ProductCountButton(props) {
  const { cart, addItem, isInCart } = useContext(CartContext);
  const handleMinusOne = () => {
    props.quantity > 1 && props.setQuantity(props.quantity - 1);
  };
  const handlePlusOne = () => {
    props.quantity < props.stock && props.setQuantity(props.quantity + 1);
  };
  useEffect(() => {}, []);
  return (
    <button
      className={
        props.isMinus
          ? "quantityButton col-2 col-lg-auto minus"
          : "quantityButton col-2 col-lg-auto plus"
      }
      disabled={
        props.isMinus ? props.quantity < 2 : props.quantity >= props.stock
      }
      onClick={props.isMinus ? handleMinusOne : handlePlusOne}
    >
      <span>{props.isMinus ? "-" : "+"}</span>
    </button>
  );
}
