import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Github, Linkedin, Whatsapp } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";

function Footer() {
  const { devData: developerData } = useContext(GeneralCompany);
  const styles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-dark-bg-subtle)",
    border: "none",
  };
  function handleContactButton(evt) {
    const key = evt.target.getAttribute("data-key");
    const value = evt.target.getAttribute("data-value");
    switch (key) {
      case "WhatsApp":
        window.open(`https://wa.me/${value}`, "_blank");
        break;
      case "LinkedIn":
        window.open(`https://www.linkedin.com/in/${value}`, "_blank");
        break;
      case "Github":
        window.open(`https://github.com/${value}`, "_blank");
        break;
    }
  }
  const icons = {
    LinkedIn: Linkedin,
    Github: Github,
    WhatsApp: Whatsapp,
  };

  return (
    <footer style={styles}>
      <Container>
        <Row className="justify-content-evenly align-items-center">
          <Col
            className="d-flex justify-content-center text-center"
            xs={12}
            lg={"auto"}
          >
            &copy; 2023 - Todos los derechos reservados. Diseñado y desarrollado
            por Koba Chajchir
          </Col>
          <Col className="d-flex justify-content-center" xs={12} lg={"auto"}>
            {developerData.map(({ key, value }) => {
              const IconComponent = icons[key];
              return (
                <Button
                  key={"devContactButton" + key}
                  variant="link"
                  style={styles}
                  onClick={handleContactButton}
                  data-key={key}
                  data-value={value}
                >
                  <IconComponent style={{ pointerEvents: "none" }} />
                </Button>
              );
            })}
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
