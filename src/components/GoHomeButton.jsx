import { Button } from "react-bootstrap";
import { HouseFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function GoHomeButton() {
  return (
    <Link to="/">
      <Button variant="primary">
        <HouseFill size={20} className="align-self-center" /> Ir al Inicio
      </Button>
    </Link>
  );
}
