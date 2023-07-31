import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Dropdown } from "react-bootstrap";
import OrderDetailPanel from "./OrderDetailPanel";
import { ThreeDotsVertical } from "react-bootstrap-icons";
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
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id de orden</th>
                  <th>Fecha</th>
                  <th>Enviado?</th>
                  <th>Nombre de usuario</th>
                  <th>Detalle</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => (
                  <tr key={order.id}>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {order.id}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {formatDate(order.date)}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="checkbox"
                        name={`isShippedChk${order}`}
                        id={`isShippedChk${order}`}
                        checked={order.shipping.isShipped}
                        style={{ pointerEvents: "none" }}
                        readOnly
                      />
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {order.buyer.username}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
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
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
