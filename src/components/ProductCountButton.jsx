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
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <button
      className="quantityButton col-2 col-lg-auto"
      disabled={
        props.isMinus ? props.quantity < 2 : props.quantity >= props.stock
      }
      onClick={props.isMinus ? handleMinusOne : handlePlusOne}
    >
      <span>{props.isMinus ? "-" : "+"}</span>
    </button>
  );
}
