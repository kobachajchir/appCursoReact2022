import { Button } from "react-bootstrap";
import { CartFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function ToCartButton() {
  const navigate = useNavigate();
  const goToCart = () => navigate("/cart");
  return (
    <Button
      variant="success"
      onClick={goToCart}
      className="d-flex justify-content-center align-items-center text-center"
    >
      Ir al Carrito
    </Button>
  );
}

export default ToCartButton;
