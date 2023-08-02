import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

function ContactDetailMessage({
  message,
  onSetReaded,
  onSetResolved,
  onMessageUpdated, // New prop
}) {
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    setLocalMessage(message);
  }, [message]);

  const handleSetReaded = () => {
    if (localMessage) {
      onSetReaded(localMessage.id, !localMessage.readed);
      setLocalMessage((prevMessage) => ({
        ...prevMessage,
        readed: !prevMessage.readed,
      }));
      onMessageUpdated(localMessage.id);
    }
  };

  const handleSetResolved = () => {
    if (localMessage) {
      onSetResolved(localMessage.id, !localMessage.resolved);
      setLocalMessage((prevMessage) => ({
        ...prevMessage,
        resolved: !prevMessage.resolved,
      }));
      onMessageUpdated(localMessage.id);
    }
  };
  const handleContactByNotification = () => {};
  const handleContactByEmail = () => {
    // Assuming you have the user's email in the message object
    const subject = `Regarding your message - ${message.subject}`;
    const body = `Hi ${message.name},\n\nThank you for your message. Here are the details:\n\n${message.message}\n\nBest regards,\nYour Organization`;

    // Create a mailto link
    const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open the user's default email client
    window.location.href = mailtoLink;
  };
  const handleContactByPhone = () => {
    // Assuming you have the user's phone number in the message object
    const phoneNumber = message.phone;

    // Create a tel link
    const telLink = `tel:${phoneNumber}`;

    // Open the phone dialer
    window.location.href = telLink;
  };

  useEffect(() => {
    console.log(message);
  }, []);
  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <label>Fecha: {localMessage.createdOn}</label>
        </Col>
        <Col xs={12}>
          <label>Asunto: {localMessage.subject}</label>
        </Col>
        <Col xs={12}>
          <label>Nombre: {localMessage.name}</label>
        </Col>
        <Col xs={12}>
          <label>Apellido: {localMessage.lastName}</label>
        </Col>
        <Col xs={12}>
          <label>Email: {localMessage.email}</label>
        </Col>
        <Col xs={12}>
          <label>Teléfono: {localMessage.phone}</label>
        </Col>
        <Col xs={12}>
          <label>Mensaje: {localMessage.message}</label>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Button variant="primary" onClick={handleSetReaded}>
            {localMessage.readed ? "Set as Unreaded" : "Set as Readed"}
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant="primary" onClick={handleSetResolved}>
            {localMessage.resolved ? "Set as unresolved" : "Set as resolved"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h4>Contactar por:</h4>
        </Col>
        <Col xs={4}>
          <Button variant="info" onClick={handleContactByNotification}>
            Notificación
          </Button>
        </Col>
        <Col xs={4}>
          <Button variant="info" onClick={handleContactByEmail}>
            Email
          </Button>
        </Col>
        <Col xs={4}>
          <Button variant="info" onClick={handleContactByPhone}>
            Teléfono
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactDetailMessage;
