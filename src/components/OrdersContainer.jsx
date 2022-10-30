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
  useEffect(() => {
    const db = getFirestore();
    const ordersCollection = collection(db, "orders");
    const queryOrders = query(ordersCollection);
    getDocs(queryOrders).then((snapshot) => {
      snapshot.docs.map((order) => {
        orderDoc = order.data();
        userDoc = getUserById(orderDoc.buyer).then((user) => {
          userVal = user;
          addressDoc = getAddressById(userVal.userAddress)
            .then((address) => {
              addressVal = address;
            })
            .then(() => {
              productDoc = getProductsById(orderDoc.items).then((products) => {
                productsVal = products;
              });
            })
            .finally(() => {
              const orderParsed = {
                id: order.id,
                buyer: {
                  ...userVal,
                  userAddress: addressVal,
                  createdOn: userVal.createdOn.toDate().toDateString(),
                },
                items: productsVal,
                date: orderDoc.date.toDate().toDateString(),
                total: orderDoc.total,
              };
              setOrders((orders) => [...orders, orderParsed]);
              setLoading(false);
            });
        });
      });
    });
    const getAddressById = async (addressDocRef) => {
      const addressSnapshot = await getDoc(addressDocRef);
      return addressSnapshot.data();
    };
    const getUserById = async (userDocRef) => {
      const userSnapshot = await getDoc(userDocRef);
      return userSnapshot.data();
    };
    const getProductsById = async (productsDocRef) => {
      let products = [];
      productsDocRef.map((productDocRef) => {
        const productSnapshot = getDoc(productDocRef).then((product) => {
          products.push(product.data());
        });
      });
      return products;
    };
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
