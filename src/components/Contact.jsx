import { useContext, useEffect, useState } from "react";
import { Button, Container, Col, Row, InputGroup, Form } from "react-bootstrap";
import contactUsBanner from "../assets/images/contact-us-banner.jpg";
import { GeneralCompany } from "../App";
import {
  Facebook,
  Instagram,
  Messenger,
  Twitter,
  Whatsapp,
} from "react-bootstrap-icons";
import ContactForm from "./ContactForm";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import formatDateAndTime, { formatNewDate } from "../tools/formatDate";

export default function Contact() {
  const { companyInfo: compInfo } = useContext(GeneralCompany);
  const [companyContactInfo, setCompanyContactInfo] = useState(
    compInfo.companyContactInfo
  );
  function sendFormEvent(form) {
    // Get the reference to the "contactMessages" collection in Firebase
    const db = getFirestore();
    const messagesRef = collection(db, "contactMessages");

    // Create the data object to be uploaded
    const data = {
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      readed: false, // By default, it's false
      resolved: false, // By default, it's false
      createdOn: formatNewDate(), // Set the current date and time of the upload
    };

    // Add the data to the "contactMessages" collection
    addDoc(messagesRef, data)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // You can perform additional actions after successfully uploading the data if needed
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        // Handle the error if the data upload fails
      });
  }
  function handleContactButton(evt) {
    const key = evt.target.getAttribute("data-key");
    const value = evt.target.getAttribute("data-value");
    switch (key) {
      case "Facebook":
        window.open(`https://www.facebook.com/${value}`, "_blank");
        break;
      case "WhatsApp":
        window.open(`https://wa.me/${value}`, "_blank");
        break;
      case "Instagram":
        window.open(`https://www.instagram.com/${value}`, "_blank");
        break;
      case "Twitter":
        window.open(`https://twitter.com/${value}`, "_blank");
        break;
    }
  }
  useEffect(() => console.log(companyContactInfo));
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <img
            src={contactUsBanner}
            alt="Contact us Banner"
            style={{
              overflow: "hidden",
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        </Col>
      </Row>
      <Row
        className="d-flex align-items-center justify-content-center text-center"
        style={{ marginTop: "15px" }}
      >
        <Col
          xs={12}
          lg={8}
          as={Row}
          className="d-flex align-items-center justify-content-center text-center"
          style={{
            backgroundColor: "var(--bs-dark-bg-subtle)",
            borderRadius: "var(--bs-border-radius)",
            marginTop: "10px",
          }}
        >
          <Col xs={10}>
            <h1>Contactanos</h1>
          </Col>
          <Col xs={10}>
            <ContactForm sendForm={sendFormEvent} />
          </Col>
        </Col>
        <Col
          as={Row}
          xs={12}
          className="d-flex align-items-center justify-content-center text-center"
          style={{
            marginTop: "10px",
          }}
        >
          <Col xs={12}>
            <h3>Seguinos en</h3>
          </Col>
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center text-center flex-row"
            as={Row}
          >
            {Object.entries(companyContactInfo).map(([key, value]) => {
              let icon;
              let color;
              let order;
              switch (key) {
                case "Facebook":
                  icon = <Facebook size={25} pointerEvents={"none"} />;
                  color = "#3B5998";
                  order = 2;
                  break;
                case "WhatsApp":
                  icon = <Whatsapp size={25} pointerEvents={"none"} />;
                  color = "#075E54";
                  order = 0;
                  break;
                case "Instagram":
                  icon = <Instagram size={25} pointerEvents={"none"} />;
                  color = "#DD2A78";
                  order = 1;
                  break;
                case "Twitter":
                  icon = <Twitter size={25} pointerEvents={"none"} />;
                  color = "#00ACEE";
                  order = 3;
                  break;
              }
              return (
                <Col
                  className={`d-flex justify-content-center align-items-center order-${order}`}
                  key={"contactButton" + key}
                >
                  <Button
                    onClick={handleContactButton}
                    data-key={key}
                    data-value={value}
                    style={{
                      backgroundColor: `${color}`,
                      borderColor: `${color}`,
                      borderRadius: "50%",
                      margin: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "50px",
                      width: "50px",
                    }}
                  >
                    {icon}
                  </Button>
                </Col>
              );
            })}
          </Col>
        </Col>
      </Row>
    </Container>
  );
}
