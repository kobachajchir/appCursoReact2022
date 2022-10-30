import { useContext } from "react";
import { CartFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./../styles/CartWidget.css";

export default function CartWidget() {
  const { quantity, total } = useContext(CartContext);
  return (
    <Link
      to={"/cart"}
      style={{ display: "flex", alignItems: "center" }}
      className="navItemLogo"
    >
      <CartFill />
      {quantity > 0 && (
        <>
          <span className="cartItemCounter">{quantity}</span>
          <span className="cartItemCounter">${total}</span>
        </>
      )}
    </Link>
  );
}
