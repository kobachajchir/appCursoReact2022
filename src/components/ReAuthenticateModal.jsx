import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { Form } from "react-router-dom";

const ReAuthenticationModal = ({ show, handleClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const db = getFirestore();

  const auth = getAuth();

  const handleCloseChangeType = () => {
    handleClose();
    setPassword("");
  };

  const handleSubmitChangeType = async () => {
    const isSuccessful = await reAuthenticate();
    if (isSuccessful) {
      handleCloseChangeType();
      if (onSuccess) onSuccess();
    }
  };

  const reAuthenticate = async () => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    try {
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      console.log(result);
      return true; // Authentication was successful
    } catch (error) {
      console.error(error);
      setErrorMessage("Error de credenciales, contraseña incorrecta");
      return false; // Authentication failed
    }
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
  return (
    <Modal show={show} onHide={handleCloseChangeType}>
      <Modal.Header>
        <Modal.Title>Re autenticarse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div controlId="formPassword" style={{ marginTop: "10px" }}>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs={"auto"}>
                <p style={{ margin: 0 }}>Tu contraseña</p>
              </Col>
              <Col xs={"auto"}>
                <input
                  type="password"
                  defaultValue={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => {
                    if (errorMessage) {
                      setErrorMessage(false);
                    }
                  }}
                  style={inputStyles}
                  autoComplete="off"
                />
              </Col>
            </Row>
          </div>
        </div>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-evenly">
        <Button variant="danger" onClick={handleCloseChangeType}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmitChangeType}>
          Autenticar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReAuthenticationModal;
