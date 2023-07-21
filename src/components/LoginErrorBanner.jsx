import { Col, Row } from "react-bootstrap";
import { XOctagonFill } from "react-bootstrap-icons";

export default function LoginErrorBanner({ children }) {
  const errorBannerStyle = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-danger-border-subtle)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginTop: "15px",
    marginBottom: "5px",
  };
  return (
    <Row
      style={errorBannerStyle}
      className="d-flex justify-content-center align-items-center text-center"
    >
      <Col
        xs={12}
        className="d-flex justify-content-center align-items-center text-center flex-row"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <XOctagonFill size={35} />
      </Col>
      <Col xs={12}>{children}</Col>
    </Row>
  );
}
