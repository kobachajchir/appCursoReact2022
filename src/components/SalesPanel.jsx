import { Col, Nav, Row, Tab } from "react-bootstrap";
import AddSalesPanel from "./AddSalesPanel";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import ListSales from "./ListSales";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function SalesPanel() {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const [activeTab, setActiveTab] = useState("listSales");
  const [needRefreshCoupons, setRefreshCoupons] = useState(false);
  const [needRefreshSales, setRefreshSales] = useState(false);
  const [sales, setSales] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const db = getFirestore();

  const fetchSales = async () => {
    const data = await getDocs(collection(db, "sales"));
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  const fetchCoupons = async () => {
    const data = await getDocs(collection(db, "coupons"));
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  useEffect(() => {
    Promise.all([fetchSales(), fetchCoupons()]).then(([sales, coupons]) => {
      setSales(sales);
      setCoupons(coupons);
    });
  }, []);

  useEffect(() => {
    if (needRefreshCoupons) {
      fetchCoupons().then((coupons) => {
        setCoupons(coupons);
        setRefreshCoupons(false);
      });
    }
    if (needRefreshSales) {
      fetchSales().then((sales) => {
        setSales(sales);
        setRefreshSales(false);
      });
    }
  }, [needRefreshCoupons, needRefreshSales]);
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
              <Nav.Link eventKey="addSales">Agregar</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="listSales">Listar</Nav.Link>
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
              <AddSalesPanel
                addedCoupon={setRefreshCoupons}
                addedSale={setRefreshSales}
              />
            </Tab.Pane>
            <Tab.Pane
              eventKey="listSales"
              as={Row}
              className={`d-flex justify-content-center align-items-center text-center ${
                activeTab !== "listSales" && "d-none"
              }`}
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              <ListSales
                sales={sales}
                coupons={coupons}
                refreshCoupons={needRefreshCoupons}
                refreshSales={needRefreshSales}
                refreshCouponsFn={setRefreshCoupons}
                refreshSalesFn={setRefreshSales}
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
