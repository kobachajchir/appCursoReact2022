import { Col, Container, Row } from "react-bootstrap";
import testCanvas from "../assets/images/testCanvas.jpg";
import "../styles/Home.css";
import ItemListContainer from "./ItemListContainer";

export default function Home(props) {
  return (
    <>
      <Container className="homeContainer" fluid>
        <Row className="d-flex justify-content-center ">
          <Col xs={12} className="canvasImageBox">
            <img src={testCanvas} alt="canvas" className="canvasImage" />
          </Col>
          <Col xs={12}>
            <ItemListContainer />
          </Col>
        </Row>
      </Container>
    </>
  );
}
