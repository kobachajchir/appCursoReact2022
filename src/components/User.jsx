import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { GeneralCompany } from "../App";
import { formatDate } from "../tools/formatDate";
import { PencilFill, PlusCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import defaultUserImage from "../assets/images/testUser.jpg";
//import ModifyAddress from "./ModifyAddress"; // You need to create this component

function User() {
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddresses] = useState(false);
  const [showModifyAddress, setShowModifyAddress] = useState(false);
  const [userProfilePicture, setProfilePicture] = useState(null);
  const { userInfo: user } = useContext(GeneralCompany);

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

  const storage = getStorage();
  const storageRef = ref(storage, "appData/userProfileImages");
  const handleModifyAddress = () => {
    setShowModifyAddress(true);
  };

  const fileInput = useRef();

  const handleModifyUserPicture = () => {
    fileInput.current.click();
  };

  const handleDeleteUserPicture = async () => {
    // Create a reference to the file to delete
    const storage = getStorage();
    const pictureRef = ref(storage, `appData/userProfileImages/${user.id}.jpg`);

    // Delete the file
    deleteObject(pictureRef)
      .then(() => {
        console.log("Profile picture deleted successfully!");
        // Set the profilePicture state to null or to a placeholder image
        setProfilePicture(null);
      })
      .catch((error) => {
        console.error("Error deleting profile picture:", error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        console.log("FileReader is done reading the file.");
        const img = new Image();

        img.onload = () => {
          console.log("Image is loaded.");
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL("image/jpeg");
          console.log("Data URL is created:", dataUrl);

          const storage = getStorage();
          const storageRef = ref(
            storage,
            `appData/userProfileImages/${user.id}.jpeg`
          );

          uploadString(storageRef, dataUrl, "data_url")
            .then((snapshot) => {
              console.log("Image is uploaded:", snapshot);
              return getDownloadURL(storageRef);
            })
            .then((downloadURL) => {
              console.log("Download URL is obtained:", downloadURL);
              setProfilePicture(downloadURL); // set profile picture here
            })
            .catch((error) => {
              console.error("Error occurred during the upload process:", error);
            });
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  };

  if (showModifyAddress) {
    return <ModifyAddress />; // ModifyAddress component should also receive user's addresses as props
  }

  async function fetchAddresses() {
    const db = getFirestore();
    const addresses = user.userAddress; // assuming user.userAddress is an array of document paths
    console.log(user);
    const fetchedAddresses = [];
    for (let address of addresses) {
      const docRef = doc(db, address.path);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        fetchedAddresses.push(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    return fetchedAddresses;
  }

  async function fetchUserProfilePicture() {
    const storage = getStorage();

    // Construct the path to the image file in Firebase Storage
    const imagePath = `appData/userProfileImages/${user.id}.jpeg`;

    // Create a reference to the file in Firebase Storage
    const imageRef = ref(storage, imagePath);

    // Get the download URL for the file
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
    }
  }

  useEffect(() => {
    if (showAddress) {
      fetchAddresses().then((addList) => {
        console.log(addList);
        setAddresses(addList);
      });
    }
  }, [showAddress]);

  useEffect(() => {
    fetchUserProfilePicture().then((profilePictureUrl) => {
      console.log(profilePictureUrl);
      setProfilePicture(profilePictureUrl);
    });
  }, []);

  return (
    <Container>
      <Row className="d-flex align-items-center justify-content-center text-center">
        <Col
          xs={12}
          className="d-flex align-items-center justify-content-center text-center flex-column"
          as={Row}
        >
          <Col>
            <img
              src={
                userProfilePicture !== null && userProfilePicture !== undefined
                  ? userProfilePicture
                  : defaultUserImage
              }
              alt="Profile"
              className=""
              style={{
                width: "25vw",
                minWidth: "250px",
                maxWidth: "500px",
                height: "auto",
                marginTop: "25px",
                borderRadius: "50%",
              }}
            />
          </Col>
          <Col style={{ marginBottom: "15px" }}>
            <Button
              onClick={handleModifyUserPicture}
              style={{
                background: "transparent",
                border: "none",
              }}
            >
              <PencilFill
                size={25}
                color="var(--bs-emphasis-color)"
              ></PencilFill>
            </Button>
            {userProfilePicture && (
              <Button
                onClick={handleDeleteUserPicture}
                style={{
                  background: "transparent",
                  border: "none",
                }}
              >
                <Trash3Fill
                  size={25}
                  color="var(--bs-emphasis-color)"
                ></Trash3Fill>
              </Button>
            )}
          </Col>
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </Col>
        <Col xs={12}>
          <h2>
            <strong>{user.username}</strong>
          </h2>
        </Col>
        <Col xs={12}>
          <p>Creado el: {formatDate(user.createdOn)}</p>
        </Col>
        <Row
          style={{
            backgroundColor: "var(--bs-secondary-bg-subtle)",
            borderRadius: "var(--bs-border-radius)",
          }}
        >
          <Col xs={12}>
            <h4
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Datos de contacto:
            </h4>
          </Col>
          <Col xs={12}>
            <h3>
              Email: <strong>{user.userEmail}</strong>
            </h3>
          </Col>
          <Col xs={12}>
            <h3>
              Telefono: <strong>{user.userPhone}</strong>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              onClick={() => setShowAddresses(!showAddress)}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              {!showAddress ? "Mostrar direcciones" : "Ocultar direcciones"}
            </Button>
          </Col>
          {showAddress &&
            addresses.map((address, index) => (
              <div
                style={{
                  backgroundColor: "var(--bs-dark-bg-subtle)",
                  borderRadius: "var(--bs-border-radius)",
                }}
              >
                <Col xs={12} key={"dirText" + index}>
                  <h3>Direccion {index + 1}:</h3>
                </Col>
                <Col xs={12} key={index}>
                  <Table
                    striped
                    bordered
                    hover
                    style={{
                      margin: 0,
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>Dirección</strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {`Departamento: ${address.apartment}, Piso: ${address.floor}, ${address.street} ${address.number}`}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>Ciudad, Provincia</strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {`${address.city}, ${address.state}`}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>Código Postal</strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {address.postalCode}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>Coordenadas</strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {Object.entries(address.mapLocation)
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
                            onClick={() => handleViewOnMap(address.mapLocation)}
                          >
                            Ver en mapa
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Button
                    onClick={handleModifyAddress}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Modificar direccion
                  </Button>
                </Col>
              </div>
            ))}
        </Row>
      </Row>
    </Container>
  );
}

export default User;
