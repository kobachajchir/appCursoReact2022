import { Col, Nav, Row, Tab } from "react-bootstrap";
import AddSalesPanel from "./AddSalesPanel";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import ListSales from "./ListSales";

export default function SalesPanel() {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const [activeTab, setActiveTab] = useState("listSales");
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
              color: "color: var(--bs-emphasis-color)",
              paddingLeft: "30px",
              paddingRight: "30px",
              borderRadius: "10px",
              marginTop: "-25px",
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="addSales">Agregar ofertas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="listSales">Listar ofertas</Nav.Link>
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
              eventKey="addSales"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "addSales" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <AddSalesPanel />
            </Tab.Pane>
            <Tab.Pane
              eventKey="listSales"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "listSales" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <ListSales />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
