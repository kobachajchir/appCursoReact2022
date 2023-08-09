import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Dropdown } from "react-bootstrap";
import OrderDetailPanel from "./OrderDetailPanel";
import { Send, SendCheckFill, ThreeDotsVertical } from "react-bootstrap-icons";
import { formatDate } from "../tools/formatDate";

function OrderPanel() {
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const db = getFirestore();

  const fetchOrders = async () => {
    const data = await getDocs(collection(db, "orders"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  useEffect(() => {
    fetchOrders()
      .then((orders) => {
        setOrderList(orders);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center text-center flex-column"
    >
      <Row>
        <Col xs={12}>
          <h3>Listado de ventas</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {!selectedOrder && (
            <div>
              {orderList.map((order) => (
                <Row
                  key={order.id}
                  className="align-items-center mb-3"
                  style={{
                    backgroundColor: "var(--bs-dark-bg-subtle)",
                    borderRadius: "var(--bs-border-radius)",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <Col>{order.id}</Col>
                  <Col>{formatDate(order.date)}</Col>
                  <Col>
                    {order.shipping.isShipped ? (
                      <SendCheckFill
                        size={25}
                        color="var(--bs-success-text-emphasis)"
                      />
                    ) : (
                      <Send size={25} />
                    )}
                  </Col>
                  <Col>{order.buyer.username}</Col>
                  <Col xs={"auto"}>
                    <Button
                      onClick={() => handleOpenOrder(order)}
                      style={{
                        backgroundColor: "var(--bs-dark-bg-subtle)",
                        border: "none",
                        color: "var(--bs-secondary-text-emphasis)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Ver en detalle
                    </Button>
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
                        <Dropdown.Item>Modificar</Dropdown.Item>
                        <Dropdown.Item>Eliminar</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              ))}
            </div>
          )}
          {selectedOrder && (
            <OrderDetailPanel
              order={selectedOrder}
              onClose={handleCloseOrder}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default OrderPanel;
