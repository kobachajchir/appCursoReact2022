import { useEffect, useRef, useState } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";

export default function ContactForm(props) {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const textAreaRef = useRef(null);
  const [disabledSend, setDisableSend] = useState(true);

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto"; // Reset the height,
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"; // then set it to its scroll height
  };

  function checkIfAllFilled() {
    if (
      form.name === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.phone === "" ||
      form.subject === "" ||
      form.message === ""
    ) {
      if (!disabledSend) {
        setDisableSend(true);
      }
    } else {
      if (disabledSend) {
        setDisableSend(false);
      }
    }
  }

  const handleInputChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    resizeTextArea();
  };

  const handleReset = () => {
    setForm({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    // validate form here
    if (
      form.name === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.phone === "" ||
      form.message === ""
    ) {
      alert("Por favor complete todos los campos");
      return;
    }
    props.sendForm(form);
    handleReset();
  };
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    width: "100%",
  };
  useEffect(() => {
    checkIfAllFilled();
  }, [form]);
  return (
    <Row className="d-flex align-items-center justify-content-center text-center">
      <Col xs={12}>
        <div>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col xs={12} lg={"auto"}>
              <div className="mb-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Nombres"
                  style={inputStyles}
                />
              </div>
            </Col>
            <Col xs={12} lg={"auto"}>
              <div className="mb-3">
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  placeholder="Apellidos"
                  style={inputStyles}
                />
              </div>
            </Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col xs={12} lg={"auto"}>
              <div className="mb-3">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Email"
                  style={inputStyles}
                />
              </div>
            </Col>
            <Col xs={12} lg={"auto"}>
              <div className="mb-3">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="Teléfono"
                  style={inputStyles}
                />
              </div>
            </Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col xs={12} lg={"auto"}>
              <div className="mb-3">
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder="Asunto"
                  style={inputStyles}
                />
              </div>
            </Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <Col xs={12} style={{ width: "100%" }}>
              <textarea
                ref={textAreaRef}
                name="message"
                value={form.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ingrese su mensaje"
                style={inputStyles}
              />
            </Col>
          </Row>
          <Row
            className="d-flex align-items-center justify-content-center text-center"
            style={{
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <Col xs={"auto"}>
              <Button variant="secondary" onClick={handleReset}>
                Restablecer
              </Button>
            </Col>
            <Col xs={"auto"}>
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={disabledSend}
              >
                Enviar
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
