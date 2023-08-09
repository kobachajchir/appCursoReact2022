import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({ show, onCancel, children, onConfirm }) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton={false}>
        <Modal.Title>Confirmar accion</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-evenly">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
