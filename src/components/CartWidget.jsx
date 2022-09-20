import { CartFill } from "react-bootstrap-icons";

export default function CartWidget() {
  return (
    <div style={{ display: "inline-flex" }}>
      <CartFill size={20} />
      <p style={{ margin: "0px", marginLeft: "5px" }}>0</p>
    </div>
  );
}
