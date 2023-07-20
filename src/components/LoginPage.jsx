import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Google, Github, Facebook } from "react-bootstrap-icons";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHoverGoogle, setIsHoverGoogle] = useState(false);
  const [isHoverFacebook, setIsHoverFacebook] = useState(false);
  const [isHoverGithub, setIsHoverGithub] = useState(false);
  const [bgColor, setBgColor] = useState("#000");

  const handleMouseEnter = (evt) => {
    setBgColor(evt.target.getAttribute("data-bgcolor"));
    switch (evt.target.getAttribute("data-buttonidentity")) {
      case "Google":
        setIsHoverGoogle(true);
        break;
      case "Facebook":
        setIsHoverFacebook(true);
        break;
      case "Github":
        setIsHoverGithub(true);
        break;
    }
  };

  const handleMouseLeave = (evt) => {
    setBgColor("");
    switch (evt.target.getAttribute("data-buttonidentity")) {
      case "Google":
        setIsHoverGoogle(false);
        break;
      case "Facebook":
        setIsHoverFacebook(false);
        break;
      case "Github":
        setIsHoverGithub(false);
        break;
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    props.logIn(email, password);
  };
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginTop: "5px",
    marginBottom: "5px",
  };
  const buttonStyleGoogle = {
    backgroundColor: !isHoverGoogle ? "unset" : "#EA4335",
    height: "50px",
    width: "50px",
  };
  const buttonStyleFacebook = {
    backgroundColor: !isHoverFacebook ? "unset" : "#3B5998",
    height: "50px",
    width: "50px",
  };
  const buttonStylesGithub = {
    backgroundColor: !isHoverGithub ? "unset" : "#666666",
    height: "50px",
    width: "50px",
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center flex-column text-center"
      style={{ minHeight: "100vh" }}
    >
      <Row
        style={{
          color: "var(--bs-body-color)",
          backgroundColor: "var(--bs-dark-bg-subtle)",
          borderRadius: "var(--bs-border-radius)",
          border: "none",
          paddingTop: "15px",
          paddingBottom: "15px",
          width: "75%",
        }}
      >
        <Col>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col xs={12} as={Row}>
              <Col xs={12}>
                <h2>Ingreso</h2>
              </Col>
              <Col xs={12}>
                <label
                  htmlFor="email"
                  style={{ marginRight: "10px", fontSize: "1.15rem" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  style={inputStyles}
                />
              </Col>
              <Col xs={12}>
                <label
                  htmlFor="password"
                  style={{ marginRight: "10px", fontSize: "1.15rem" }}
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  style={inputStyles}
                />
              </Col>
              <Col
                xs={12}
                as={Row}
                className="d-flex align-items-center justify-content-center text-center"
              >
                <Col
                  xs={12}
                  style={{
                    margin: 0,
                    marginTop: "15px",
                  }}
                >
                  <Button onClick={handleLogin}>Ingresar</Button>
                </Col>
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-center text-center flex-column"
                >
                  <p
                    style={{
                      margin: 0,
                      marginTop: "15px",
                      marginBottom: "5px",
                    }}
                  >
                    No estas registrado?
                  </p>
                  <Button variant="outline-primary">Registrarse</Button>
                </Col>
              </Col>
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <hr />
              </div>
            </Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center text-center"
            >
              <Row className="d-flex align-items-center justify-content-center text-center">
                <Col>
                  <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center justify-content-center"
                    style={buttonStyleGoogle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-buttonidentity="Google"
                  >
                    <Google size={25} />
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center justify-content-center"
                    style={buttonStyleFacebook}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-buttonidentity="Facebook"
                  >
                    <Facebook size={25} />
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center justify-content-center"
                    style={buttonStylesGithub}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-buttonidentity="Github"
                  >
                    <Github size={25} />
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
