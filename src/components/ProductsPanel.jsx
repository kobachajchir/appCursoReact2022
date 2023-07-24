import { useState, useEffect, useContext, useCallback } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Col,
  Row,
  Button,
  FormControl,
  FormCheck,
  FormSelect,
  Container,
  Tab,
  Nav,
} from "react-bootstrap";
import EditProductPanel from "./EditProductPanel";
import { GeneralCompany } from "../App";
import ProductListingPanel from "./ProductListingPanel";
import { useMediaQuery } from "react-responsive";
import AddProductPanel from "./AddProductPanel";

export default function ProductsPanel() {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const [activeTab, setActiveTab] = useState("listProds");
  return (
    <Tab.Container
      defaultActiveKey="company"
      className="d-flex justify-content-center align-items-center"
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Row className="d-flex justify-content-center align-items-center">
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center"
        >
          <Nav
            variant="underline"
            className="flex-row"
            style={{
              backgroundColor: "var(--bs-dark-bg-subtle)",
              color: "color: var(--bs-emphasis-color)",
              paddingLeft: "30px",
              paddingRight: "30px",
              borderRadius: "10px",
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="addProd">Agregar producto</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="listProds">Listar productos</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col
          xs={10}
          className="d-flex justify-content-center align-items-center"
        >
          <Tab.Content
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "50vh",
              minWidth: !isLg ? "60%" : "90%",
              borderColor: "var(--bs-dark-bg-subtle)",
              borderRadius: "10px",
              backgroundColor: "var(--bs-dark-bg-subtle)",
              color: "color: var(--bs-emphasis-color)",
              marginBottom: "25px",
            }}
          >
            <Tab.Pane
              eventKey="addProd"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "addProd" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <AddProductPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="listProds"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "listProds" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <ProductListingPanel />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
