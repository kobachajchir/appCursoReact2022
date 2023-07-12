import { Col, Row, Table } from "react-bootstrap";

export default function OrderToTable({ order }) {
  return (
    <Row
      className={"justify-content-center text-center"}
      style={{ backgroundColor: "#fafafa" }}
    >
      <Col xs={10}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2}>Order Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Order ID</td>
              <td>{order.id}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{new Date(order.date.seconds * 1000).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${order.total}</td>
            </tr>
            <tr>
              <td>Items</td>
              <td>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Code</th>
                      <th>Price</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.amount}</td>
                        <td>{item.code}</td>
                        <td>${item.price}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2}>Buyer Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{order.buyer.buyerName}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{order.buyer.buyerPhone}</td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2}>Shipping Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Street</td>
              <td>{order.shipping.address.street}</td>
            </tr>
            <tr>
              <td>House Number</td>
              <td>{order.shipping.address.houseNumber}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{order.shipping.address.city}</td>
            </tr>
            <tr>
              <td>State</td>
              <td>{order.shipping.address.state}</td>
            </tr>
            <tr>
              <td>Postal Code</td>
              <td>{order.shipping.address.postalCode}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td>{order.shipping.address.country}</td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2}>Payment Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Method</td>
              <td>{order.payment.method}</td>
            </tr>
            {order.payment.method === "card" && (
              <>
                <tr>
                  <td>Card Owner</td>
                  <td>{order.payment.cardInfo.cardOwner}</td>
                </tr>
                <tr>
                  <td>Due Amount</td>
                  <td>${order.payment.cardInfo.dueAmount}</td>
                </tr>
                <tr>
                  <td>Dues</td>
                  <td>{order.payment.cardInfo.dues}</td>
                </tr>
                <tr>
                  <td>Expiration Date</td>
                  <td>
                    {order.payment.cardInfo.expirationDate.month}/
                    {order.payment.cardInfo.expirationDate.year}
                  </td>
                </tr>
                <tr>
                  <td>Last Digits</td>
                  <td>{order.payment.cardInfo.lastDigits}</td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
