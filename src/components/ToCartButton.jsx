import { Button } from "react-bootstrap";
import { CartFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function ToCartButton() {
  const navigate = useNavigate();
  const goToCart = () => navigate("/cart");
  return (
    <Button variant="success" onClick={goToCart}>
      <CartFill size={20} className="align-self-center" /> Ir al Carrito
    </Button>
  );
}

export default ToCartButton;
