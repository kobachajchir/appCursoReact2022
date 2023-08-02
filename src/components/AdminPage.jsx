import { Col, Nav, Row, Tab } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import CompanyDataPanel from "./CompanyDataPanel";
import { useState } from "react";
import ProductsPanel from "./ProductsPanel";
import UserPanel from "./UserPanel";
import OrderPanel from "./OrderPanel";
import SalesPanel from "./SalesPanel";
import ContactPanel from "./ContactPanel";

export default function AdminPage() {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const [activeTab, setActiveTab] = useState("contact");
  return (
    <Tab.Container
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
              marginTop: "25px",
              marginBottom: "15px",
              paddingLeft: "30px",
              paddingRight: "30px",
              borderRadius: "10px",
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="company">Empresa</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="products">Productos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sales">Ofertas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="orders">Ventas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="users">Usuarios</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contact">Contacto</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="config">Configuracion</Nav.Link>
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
              color: "color: var(--bs-emphasis-color)",
              marginBottom: "25px",
            }}
          >
            <Tab.Pane
              eventKey="company"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "company" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <CompanyDataPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="products"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "products" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <ProductsPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="sales"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "sales" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <SalesPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="orders"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "orders" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <OrderPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="users"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "users" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <UserPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="contact"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "contact" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <ContactPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="config"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "config" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              Pestaña Configuracion
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
