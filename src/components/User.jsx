import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  function goToOrders() {
    navigate("/orders");
  }
  return (
    <>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 className="col-12">SOLO DE PRUEBA</h2>
          </Col>
          <Col xs={12}>
            <h4 className="col-12">
              Ahora solo el boton redirige a mostrar todas las ordenes de
              Firebase
            </h4>
          </Col>
          <Col xs={12}>
            <button onClick={goToOrders}> Ver Ordenes </button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
