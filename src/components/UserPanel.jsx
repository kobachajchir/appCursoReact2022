import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Dropdown,
  Modal,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import {
  PersonCheckFill,
  PersonDashFill,
  PersonXFill,
  ThreeDotsVertical,
  X,
  XOctagonFill,
} from "react-bootstrap-icons";
import { GeneralCompany } from "../App";
//import ModifyUserAccount from "./ModifyUserAccount";

export default function UserPanel() {
  const [users, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newType, setNewType] = useState("");
  const [showModify, setShowModify] = useState(false);
  const [showChangeType, setShowChangeType] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modifyEnableDisable, setEnableDisable] = useState(false);
  const [filterUserType, setFilterUserType] = useState("all");
  const errorBannerStyle = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-danger-border-subtle)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginTop: "15px",
    marginBottom: "5px",
    width: "80%",
  };

  const db = getFirestore();
  const auth = getAuth();
  const { username: username } = useContext(GeneralCompany);

  const fetchUsers = async () => {
    const data = await getDocs(collection(db, "users"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  useEffect(() => {
    fetchUsers()
      .then((userList) => {
        setUsersList(userList);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleModify = (user) => {
    setSelectedUser(user);
    setShowModify(true);
  };

  const handleCloseModify = () => {
    setShowModify(false);
    setSelectedUser(null);
  };

  const handleEnableDisable = async (user) => {
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { enabled: !user.enabled });
    setEnableDisable(!modifyEnableDisable);
  };

  const handleChangeType = (user) => {
    setSelectedUser(user);
    setShowChangeType(true);
  };

  const handleCloseChangeType = () => {
    setShowChangeType(false);
    setPassword("");
  };

  const handleSubmitChangeType = async () => {
    reAuthenticate().then(() => {
      setShowChangeType(false);
    });
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
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, { status: newType });
    } catch (error) {
      console.error(error);
      setErrorMessage("Error de credenciales, contraseña incorrecta");
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
  useEffect(() => {
    fetchUsers().then((userList) => {
      setUsersList(userList);
    });
  }, [showChangeType, showModify, modifyEnableDisable]);
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center text-center flex-column"
    >
      {errorMessage && (
        <Row
          style={errorBannerStyle}
          className="d-flex justify-content-center align-items-center text-center"
        >
          <Col xs={10} className="d-flex justify-content-end">
            <X onClick={() => setErrorMessage("")} size={30} />
          </Col>
          <Col
            xs={10}
            className="d-flex justify-content-center align-items-center text-center flex-row"
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <XOctagonFill size={35} />
          </Col>
          <Col xs={10}>{errorMessage}</Col>
        </Row>
      )}
      <Row>
        <Col xs={12}>
          <h3>Listado de usuarios</h3>
        </Col>
      </Row>
      <Row
        className="d-flex justify-content-center align-items-center text-center flex-row"
        style={{ marginBottom: "10px" }}
      >
        <Col xs={12} lg={"auto"}>
          <h5 style={{ margin: 0 }}>Mostrar</h5>
        </Col>
        <Col xs={12} lg={"auto"}>
          <select
            value={filterUserType}
            style={inputStyles}
            onChange={(e) => setFilterUserType(e.target.value)}
            onSelect={(e) => setFilterUserType(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="user">Usuarios</option>
            <option value="seller">Vendedores</option>
            <option value="admin">Administradores</option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {users
            .filter(
              (user) =>
                filterUserType === "all" || user.status === filterUserType
            )
            .map((user) => (
              <Row
                key={user.id}
                className="align-items-center mb-3"
                style={{
                  backgroundColor: "var(--bs-dark-bg-subtle)",
                  borderRadius: "var(--bs-border-radius)",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <Col>
                  {user.username}
                  {user.username === username ? " (Tu)" : ""}
                </Col>
                <Col>{user.userEmail}</Col>
                <Col>{user.userPhone}</Col>
                <Col>
                  {user.status === "admin"
                    ? "Administrador"
                    : user.status === "user"
                    ? "Usuario"
                    : user.status === "seller"
                    ? "Vendedor"
                    : ""}
                </Col>
                <Col>
                  {user.enabled ? (
                    <PersonCheckFill
                      size={25}
                      color="var(--bs-success-text-emphasis)"
                    />
                  ) : (
                    <PersonXFill
                      size={25}
                      color="var(--bs-danger-text-emphasis)"
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
                      <Dropdown.Item onClick={() => handleModify(user)}>
                        Modificar
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleEnableDisable(user)}
                        disabled={user.username === username ? true : false}
                      >
                        {user.enabled ? "Deshabilitar" : "Habilitar"}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangeType(user)}
                        disabled={user.username === username ? true : false}
                      >
                        Cambiar tipo de cuenta
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            ))}
        </Col>
      </Row>

      <Modal show={showChangeType} onHide={handleCloseChangeType}>
        <Modal.Header>
          <Modal.Title>Modificar tipo de cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAccountType">
              <Row className="d-flex justify-content-center align-items-center">
                <Col xs={"auto"}>
                  <Form.Label>Tipo de cuenta</Form.Label>
                </Col>
                <Col xs={"auto"}>
                  <Form.Control
                    as="select"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    onSelect={(e) => setNewType(e.target.value)}
                  >
                    <option
                      value="user"
                      disabled={selectedUser?.status === "user"}
                    >
                      Usuario
                      {selectedUser?.status === "user" ? " (Actual)" : ""}
                    </option>
                    <option
                      value="admin"
                      disabled={selectedUser?.status === "admin"}
                    >
                      Administrador
                      {selectedUser?.status === "admin" ? " (Actual)" : ""}
                    </option>
                    <option
                      value="seller"
                      disabled={selectedUser?.status === "seller"}
                    >
                      Vendedor
                      {selectedUser?.status === "seller" ? " (Actual)" : ""}
                    </option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="formPassword" style={{ marginTop: "10px" }}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col xs={"auto"}>
                  <Form.Label>Tu contraseña</Form.Label>
                </Col>
                <Col xs={"auto"}>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Form>

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

      {/*{showModify && <ModifyUserAccount user={selectedUser} onClose={handleCloseModify} />}*/}
    </Container>
  );
}
