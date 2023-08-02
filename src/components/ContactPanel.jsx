import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import ContactDetailMessage from "./ContactDetailMessage";
import { ArrowLeft } from "react-bootstrap-icons";

export default function ContactPanel() {
  const [messageList, setMessagesList] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);

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

  const handleVerDetalles = (messageId) => {
    const selected = messageList.find((message) => message.id === messageId);
    console.log(selected);
    setSelectedMessage(selected);
  };

  const handleVolver = () => {
    setSelectedMessage(null);
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
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Asunto</th>
                  <th>Leído</th>
                  <th>Resuelto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {messageList.map((message) => (
                  <tr key={message.id} style={{ verticalAlign: "baseline" }}>
                    <td>{message.createdOn}</td>
                    <td>{message.subject}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={message.readed}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={message.resolved}
                        readOnly
                      />
                    </td>
                    <td>
                      <button onClick={() => handleVerDetalles(message.id)}>
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}
