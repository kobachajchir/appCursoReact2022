import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Accordion } from "react-bootstrap";
import { GeneralCompany } from "../App";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

export default function ModifyUserForm() {
  const { userInfo, setUserData: updateUserData } = useContext(GeneralCompany);

  const [username, setUsername] = useState(userInfo.username);
  const [userPhone, setUserPhone] = useState(userInfo.userPhone);
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    userInfo.prefersDarkMode
  );
  const [hasChanged, setHasChanged] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);

  async function fetchAddresses() {
    const db = getFirestore();
    const addresses = userInfo.userAddress; // assuming user.userAddress is an array of document paths
    const fetchedAddresses = [];
    for (let address of addresses) {
      const docRef = doc(db, address.path);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        fetchedAddresses.push(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    return fetchedAddresses;
  }

  useEffect(() => {
    if (showAddresses && addresses.length === 0) {
      fetchAddresses().then((addList) => {
        console.log(addList);
        setAddresses(addList);
      });
    }
  }, [showAddresses]);

  function handleViewOnMap(mapLocation) {
    let lat, long;
    Object.entries(mapLocation).map((entry) => {
      if (entry[0] === "_lat") {
        lat = entry[1];
      } else if (entry[0] === "_long") {
        long = entry[1];
      }
    });
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${long}`,
      "_blank"
    );
  }

  useEffect(() => {
    if (
      username !== userInfo.username ||
      userPhone !== userInfo.userPhone ||
      prefersDarkMode !== userInfo.prefersDarkMode
    ) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [username, userPhone, prefersDarkMode, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...userInfo,
      username,
      userPhone,
      prefersDarkMode,
    };
    console.log("update");
    updateUserData(updatedUser);

    // Disable the button after update
    setHasChanged(false);
  };

  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginBottom: "5px",
  };

  return (
    <Container>
      <Form
        as={Row}
        className="d-flex justify-content-center align-items-center flex-column"
      >
        <Form.Group
          controlId="username"
          as={Col}
          style={{ width: "50%", marginTop: "10px" }}
        >
          <Form.Label style={{ margin: 0 }}>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyles}
          />
        </Form.Group>

        <Form.Group
          controlId="userPhone"
          as={Col}
          style={{ width: "50%", marginTop: "10px" }}
        >
          <Form.Label style={{ margin: 0 }}>Telefono</Form.Label>
          <Form.Control
            type="text"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            required
            style={inputStyles}
          />
        </Form.Group>

        <Form.Group
          controlId="prefersDarkMode"
          as={Col}
          style={{ width: "50%", marginTop: "10px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Form.Check
            type="switch"
            label="Prefiere modo oscuro?"
            checked={prefersDarkMode}
            onChange={(e) => setPrefersDarkMode(e.target.checked)}
          />
        </Form.Group>
        <Col
          className="d-flex justify-content-center align-items-center flex-column"
          xs={12}
        >
          <Button
            onClick={() => setShowAddresses(!showAddresses)}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {!showAddresses ? "Ver direcciones" : "Ocultar direcciones"}
          </Button>
        </Col>
        {showAddresses && (
          <Col
            className="d-flex justify-content-center align-items-center flex-column"
            xs={12}
          >
            <Accordion alwaysOpen={false}>
              {addresses.map((add, inx) => {
                return (
                  <AccordionItem key={"add" + inx}>
                    <AccordionHeader>
                      {"Direccion " + (inx + 1)}
                    </AccordionHeader>
                    <AccordionBody className="d-flex justify-content-center align-items-center flex-column text-center">
                      <p style={{ margin: 0 }}>
                        <strong>Departamento:</strong> {add.apartment},{" "}
                        <strong>Piso:</strong> {add.floor}, {add.street}{" "}
                        {add.number}
                      </p>

                      <div>
                        <strong>Ciudad:</strong> {add.city}
                      </div>
                      <div>
                        {" "}
                        <strong>Codigo Postal:</strong> {add.postalCode}
                      </div>
                      <div>
                        <strong>Provincia:</strong> {add.state}
                      </div>
                      <div>
                        <strong>Coordenadas:</strong>
                        {Object.entries(add.mapLocation)
                          .map(
                            (entry, index) =>
                              `${parseFloat(entry[1]).toFixed(3)}${
                                index === 0 ? "° S" : "° W"
                              }`
                          )
                          .join(", ")}
                        <button
                          style={{
                            backgroundColor: "var(--bs-dark-bg-subtle)",
                            border: "none",
                            color: "var(--bs-secondary-text-emphasis)",
                            marginLeft: "10px",
                          }}
                          onClick={() => handleViewOnMap(add.mapLocation)}
                        >
                          Ver en mapa
                        </button>
                      </div>
                      <Button
                        style={{
                          backgroundColor: "var(--bs-dark-bg-subtle)",
                          border: "none",
                          color: "var(--bs-secondary-text-emphasis)",
                          marginTop: "10px",
                        }}
                      >
                        Modificar direccion
                      </Button>
                    </AccordionBody>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Col>
        )}
        <Col
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ width: "50%", marginTop: "10px" }}
        >
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!hasChanged}
          >
            Modificar
          </Button>
        </Col>
      </Form>
    </Container>
  );
}
