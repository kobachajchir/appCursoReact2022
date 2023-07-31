import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Github, Linkedin, Whatsapp } from "react-bootstrap-icons";
import { GeneralCompany } from "../App";

function Footer() {
  const { devData: developerData } = useContext(GeneralCompany);
  const styles = {
    color: "var(--bs-body-color)",
    backgroundColor: "transparent",
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
    <footer
      className="d-flex align-items-center justify-content-center"
      style={{
        ...styles,
        position: "absolute",
        zIndex: 10,
        top: "100%",
        width: "100%",
      }}
    >
      <div>
        &copy; 2023 - Todos los derechos reservados. Diseñado y desarrollado por
        Koba Chajchir
      </div>
      <div>
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
      </div>
    </footer>
  );
}

export default Footer;
