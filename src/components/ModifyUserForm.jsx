import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { GeneralCompany } from "../App";

export default function ModifyUserForm() {
  const { userInfo, setUserData: updateUserData } = useContext(GeneralCompany);

  const [username, setUsername] = useState(userInfo.username);
  const [userPhone, setUserPhone] = useState(userInfo.userPhone);
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    userInfo.prefersDarkMode
  );
  const [hasChanged, setHasChanged] = useState(false);

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
          <Form.Label style={{ margin: 0 }}>Username</Form.Label>
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
          <Form.Label style={{ margin: 0 }}>User Phone</Form.Label>
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
            label="Prefers Dark Mode"
            checked={prefersDarkMode}
            onChange={(e) => setPrefersDarkMode(e.target.checked)}
          />
        </Form.Group>
        <Col
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ width: "50%", marginTop: "10px" }}
        >
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!hasChanged}
          >
            Update
          </Button>
        </Col>
      </Form>
    </Container>
  );
}
