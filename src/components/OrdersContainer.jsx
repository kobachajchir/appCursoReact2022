import {
  collection,
  getDocs,
  getFirestore,
  DocumentReference,
  query,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import OrderToTable from "./OrderToTable";

export default function OrdersContainer() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  let orderDoc;
  let userDoc;
  let productDoc;
  let addressDoc;
  let userVal;
  let addressVal;
  let productsVal;
  const navigate = useNavigate();
  const getOrders = async () => {
    const db = getFirestore();
    const ordersCollection = collection(db, "orders");
    const queryOrders = query(ordersCollection);
    const ordersSnapshot = await getDocs(queryOrders);

    const ordersData = ordersSnapshot.docs.map((order) => {
      const orderData = order.data();

      const buyerInfo = {
        buyerName: orderData.buyer.username,
        buyerPhone: orderData.buyer.userPhone,
      };

      const shippingAddress = {
        street: orderData.shipping.address.street,
        houseNumber: orderData.shipping.address.houseNumber,
        city: orderData.shipping.address.city,
        state: orderData.shipping.address.state,
        postalCode: orderData.shipping.address.postalCode,
        country: orderData.shipping.address.country,
      };

      const cardInfo = orderData.payment.cardInfo;

      return {
        id: order.id,
        buyer: buyerInfo,
        date: orderData.date,
        total: orderData.total,
        items: orderData.items,
        payment: {
          method: orderData.payment.card ? "card" : "cash",
          cardInfo: {
            cardOwner: cardInfo.cardOwner,
            dueAmount: cardInfo.dueAmount,
            dues: cardInfo.dues,
            expirationDate: {
              month: cardInfo.expirationDate.month,
              year: cardInfo.expirationDate.year,
            },
            lastDigits: cardInfo.lastDigits,
          },
        },
        shipping: {
          isShipped: orderData.isShipped,
          address: shippingAddress,
        },
        // Other order details
      };
    });

    setOrders(ordersData);
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  function navigateToOrderDetail(index, orderId) {
    navigate(`/order/${orderId}`, { state: orders[index] });
  }
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h1>Orders</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              orders.map((order, index) => (
                <Button
                  variant="info"
                  key={`btnTo${order.id}`}
                  onClick={() => {
                    navigateToOrderDetail(index, order.id);
                  }}
                >
                  Order {order.id}
                </Button>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
