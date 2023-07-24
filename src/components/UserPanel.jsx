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
import { ThreeDotsVertical, X, XOctagonFill } from "react-bootstrap-icons";
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
        console.log(userList);
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
          <h3>User List</h3>
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Tipo de cuenta</th>
                <th>Habilitado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (user) =>
                    filterUserType === "all" || user.status === filterUserType
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {user.username}
                      {user.username === username ? " (Tu)" : ""}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {user.userEmail}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {user.userPhone}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {user.status === "admin"
                        ? "Administrador"
                        : user.status === "user"
                        ? "Usuario"
                        : user.status === "seller"
                        ? "Vendedor"
                        : ""}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="checkbox"
                        name={`enabledChk${user.username}`}
                        id={`enabledChk${user.username}`}
                        checked={user.enabled}
                        style={{ pointerEvents: "none" }}
                        readOnly
                      />
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
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
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showChangeType} onHide={handleCloseChangeType}>
        <Modal.Header>
          <Modal.Title>Modificar tipo de cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAccountType">
              <Form.Label>Tipo de cuenta</Form.Label>
              <Form.Control
                as="select"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                onSelect={(e) => setNewType(e.target.value)}
              >
                <option value="user" disabled={selectedUser?.status === "user"}>
                  Usuario{selectedUser?.status === "user" ? " (Actual)" : ""}
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
                  Vendedor{selectedUser?.status === "seller" ? " (Actual)" : ""}
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Tu contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Form.Group>
          </Form>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-evenly">
          <Button variant="secondary" onClick={handleCloseChangeType}>
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
