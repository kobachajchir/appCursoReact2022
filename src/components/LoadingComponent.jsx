import { Col, Container, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function LoadingComponent({ as, size, text, style }) {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        color: "var(--bs-body-color)",
        backgroundColor: "var(--bs-secondary-bg)",
      }}
    >
      <Row className="d-flex justify-content-center align-items-center">
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner
            animation="border"
            as={as ? as : "span"}
            size={size ? size : "md"}
            style={{ color: "var(--bs-body-color)" }}
          />
        </Col>
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center"
        >
          <h2 style={{ color: "var(--bs-body-color)", marginTop: "5px" }}>
            Cargando {text}
          </h2>
        </Col>
      </Row>
    </Container>
  );
}

export default LoadingComponent;
