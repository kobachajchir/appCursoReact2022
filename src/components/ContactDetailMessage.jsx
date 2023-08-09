import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import {
  ArrowLeft,
  At,
  BellFill,
  CheckCircle,
  CheckCircleFill,
  EnvelopeFill,
  EnvelopeOpenFill,
  PhoneFill,
  TelephoneFill,
} from "react-bootstrap-icons";

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
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col xs={12}>
          <h3>{localMessage.subject}</h3>
        </Col>
        <Col xs={12}>
          <h6>{localMessage.createdOn}</h6>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col xs={12}>
          <label>
            <strong>Mensaje de:</strong> {localMessage.name}{" "}
            {localMessage.lastName}
          </label>
        </Col>
        <Col xs={12}>
          <label>
            <strong>Email: </strong>
            {localMessage.email}
          </label>
        </Col>
        <Col xs={12}>
          <label>
            <strong>Teléfono: </strong>
            {localMessage.phone}
          </label>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col xs={12}>
          <label>{localMessage.message}</label>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={handleSetReaded}
            style={{ marginLeft: "5px", marginRight: "5px" }}
            className="d-flex align-items-center"
          >
            {localMessage.readed
              ? "Marcar como no leido "
              : "Marcar como leido "}
            {localMessage.readed ? (
              <EnvelopeFill
                size={20}
                style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
              />
            ) : (
              <EnvelopeOpenFill
                size={20}
                style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
              />
            )}
          </Button>
          <Button
            variant="primary"
            onClick={handleSetResolved}
            style={{ marginLeft: "5px", marginRight: "5px" }}
            className="d-flex align-items-center"
          >
            {localMessage.resolved
              ? "Marcar como no resuelto "
              : "Marcar como resuelto "}
            {localMessage.resolved ? (
              <CheckCircle
                size={20}
                style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
              />
            ) : (
              <CheckCircleFill
                size={20}
                style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
              />
            )}
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col xs={12}>
          <h4>Contactar por:</h4>
        </Col>
        <Col className="d-flex flex-row align-items-center text-center justify-content-center">
          <Button
            variant="info"
            onClick={handleContactByNotification}
            style={{ marginLeft: "5px", marginRight: "5px" }}
            className="d-flex align-items-center"
          >
            <BellFill size={20} />
          </Button>
          <Button
            variant="info"
            onClick={handleContactByEmail}
            style={{ marginLeft: "5px", marginRight: "5px" }}
            className="d-flex align-items-center"
          >
            <At size={20} />
          </Button>
          <Button
            variant="info"
            onClick={handleContactByPhone}
            style={{ marginLeft: "5px", marginRight: "5px" }}
            className="d-flex align-items-center"
          >
            <TelephoneFill size={20} />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactDetailMessage;
