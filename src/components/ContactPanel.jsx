import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Dropdown } from "react-bootstrap";
import ContactDetailMessage from "./ContactDetailMessage";
import {
  ArrowLeft,
  CheckCircle,
  CheckCircleFill,
  EnvelopeFill,
  EnvelopeOpenFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import ConfirmModal from "./ConfirmModal";

export default function ContactPanel() {
  const [messageList, setMessagesList] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const fetchContactMessages = async () => {
    const db = getFirestore();
    const data = await getDocs(collection(db, "contactMessages"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  useEffect(() => {
    fetchContactMessages()
      .then((msgList) => {
        setMessagesList(msgList);
      })
      .catch((error) => console.error(error));
  }, []);

  const selectMessage = (messageId) => {
    const selected = messageList.find((message) => message.id === messageId);
    console.log(selected);
    setSelectedMessage(selected);
  };

  const handleVolver = () => {
    setSelectedMessage(null);
  };

  const cancelDelete = () => {
    setSelectedMessage(null);
    setConfirmDialogOpen(false);
  };

  const deleteMessage = async () => {
    try {
      if (!selectedMessage) {
        console.error("No message selected to delete.");
        return;
      }

      // Get the Firestore instance
      const db = getFirestore();

      // Reference the message document to be deleted
      const messageRef = doc(db, "contactMessages", selectedMessage.id);

      // Delete the document
      await deleteDoc(messageRef);

      // Optional: If you want to remove the deleted message from the local messageList state
      setMessagesList((prevMessages) =>
        prevMessages.filter((message) => message.id !== selectedMessage.id)
      );

      // Close the modal or do any other necessary action after deletion
      setSelectedMessage(null);
      if (isConfirmDialogOpen) {
        setConfirmDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSetReaded = async (messageId, readedValue) => {
    const db = getFirestore();
    const messageRef = doc(db, "contactMessages", messageId);
    await updateDoc(messageRef, { readed: readedValue });

    // Find the index of the updated message in the messageList
    const updatedIndex = messageList.findIndex(
      (message) => message.id === messageId
    );

    if (updatedIndex !== -1) {
      // If the message is found in the list, update its "readed" property
      const updatedMessage = {
        ...messageList[updatedIndex],
        readed: readedValue,
      };
      const updatedMessageList = [...messageList];
      updatedMessageList[updatedIndex] = updatedMessage;
      setMessagesList(updatedMessageList);
    }
  };

  const handleSetResolved = async (messageId, resolvedValue) => {
    const db = getFirestore();
    const messageRef = doc(db, "contactMessages", messageId);
    await updateDoc(messageRef, { resolved: resolvedValue });

    // Find the index of the updated message in the messageList
    const updatedIndex = messageList.findIndex(
      (message) => message.id === messageId
    );

    if (updatedIndex !== -1) {
      // If the message is found in the list, update its "resolved" property
      const updatedMessage = {
        ...messageList[updatedIndex],
        resolved: resolvedValue,
      };
      const updatedMessageList = [...messageList];
      updatedMessageList[updatedIndex] = updatedMessage;
      setMessagesList(updatedMessageList);
    }
  };
  useEffect(() => {
    if (selectedMessage) {
      setShowMessageDetails(true);
    } else {
      setShowMessageDetails(false);
    }
  }, [selectedMessage]);
  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center align-items-center">
          <Col
            xs={12}
            className="d-flex justify-content-center align-items-center flex-row"
          >
            {showMessageDetails && (
              <Button
                variant="danger"
                onClick={handleVolver}
                style={{ marginRight: "10px" }}
              >
                <ArrowLeft color={"var(--bs-emphasis-color)"} />
              </Button>
            )}
            <h3>
              {!showMessageDetails
                ? "Listado de Mensajes"
                : "Detalles de mensaje"}
            </h3>
          </Col>
          <Col xs={12}>
            {showMessageDetails && selectedMessage ? (
              <ContactDetailMessage
                message={selectedMessage}
                onSetReaded={handleSetReaded}
                onSetResolved={handleSetResolved}
                onMessageUpdated={(updatedMessageId) => {
                  fetchContactMessages()
                    .then((msgList) => {
                      setMessagesList(msgList);
                    })
                    .catch((error) => console.error(error));
                }}
              />
            ) : (
              <>
                {messageList.map((message) => (
                  <Row
                    key={message.id}
                    className="align-items-center mb-3"
                    style={{
                      backgroundColor: "var(--bs-dark-bg-subtle)",
                      borderRadius: "var(--bs-border-radius)",
                    }}
                  >
                    <Col>{message.createdOn}</Col>
                    <Col>{message.subject}</Col>
                    <Col>
                      {!message.readed ? (
                        <EnvelopeFill
                          size={25}
                          style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
                          color="var(--bs-danger-text-emphasis)"
                        />
                      ) : (
                        <EnvelopeOpenFill
                          size={25}
                          style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
                        />
                      )}
                    </Col>
                    <Col>
                      {!message.resolved ? (
                        <CheckCircle
                          size={25}
                          style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
                        />
                      ) : (
                        <CheckCircleFill
                          color="var(--bs-success-text-emphasis)"
                          size={25}
                          style={{ marginLeft: "2.5px", marginRight: "2.5px" }}
                        />
                      )}
                    </Col>
                    <Col>
                      <Dropdown>
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--bs-secondary-text-emphasis)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => selectMessage(message.id)}
                          >
                            Ver detalles
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              selectMessage(message.id);
                              setConfirmDialogOpen(true);
                            }}
                          >
                            Eliminar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Col>
        </Row>
      </Container>
      <ConfirmModal
        show={isConfirmDialogOpen}
        onConfirm={deleteMessage}
        onCancel={cancelDelete}
      >
        Confirmas que quieres borrar el mensaje titulado{" "}
        <strong>{selectedMessage?.subject}</strong>
        {"?"}
      </ConfirmModal>
    </>
  );
}
