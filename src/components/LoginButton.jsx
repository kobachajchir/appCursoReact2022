import { Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="primary"
      className="d-flex justify-content-center align-items-center"
      onClick={() => {
        navigate("/login", { state: { redirectTo: "/cart" } });
      }}
    >
      <p style={{ margin: 0 }}>Iniciar sesion</p>
      <PersonCircle style={{ marginLeft: "5px", marginRight: "5px" }} />
    </Button>
  );
}
