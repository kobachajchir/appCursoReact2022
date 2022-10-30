import { Col, Container, Row, Table } from "react-bootstrap";

export default function OrderToTable({ order }) {
  return (
    <>
      <Container>
        <Row style={{ marginTop: "25px", marginBottom: "25px" }}>
          <Col xs={12} className="text-center">
            <h2>Order ID: {order.id}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="justify-content-center text-center">
            <h3>Poducts Info</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Title</th>
                  <th>Item Description</th>
                  <th>Item Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`entry${item.code}`}>
                    <td>{item.code}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="justify-content-center text-center">
            <h3>Buyer Info</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Postal Code</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.buyer.username}</td>
                  <td>{order.buyer.userPhone}</td>
                  <td>{`${order.buyer.userAddress.street}  ${order.buyer.userAddress.number}, ${order.buyer.userAddress.city}, ${order.buyer.userAddress.state}`}</td>
                  <td>{`CP: ${order.buyer.userAddress.postalCode}`}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="justify-content-center text-center">
            <h3>Order Info</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Order Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>${order.total}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}
