import React, { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";

export default function UserOrders() {
  const { username } = useContext(GeneralCompany);
  const [orderList, setOrderList] = useState([]);
  const db = getFirestore();

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("buyer.username", "==", username)
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return results;
  };

  const formatDate = (firebaseTimestamp) => {
    // convert Firestore timestamp to JavaScript Date object
    const jsDate = new Date(firebaseTimestamp.seconds * 1000);

    // format date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(jsDate);

    return formattedDate;
  };

  useEffect(() => {
    fetchOrders().then((list) => {
      setOrderList(list);
      console.log(list);
    });
  }, []);

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center text-center flex-column">
        <Row>
          <Col xs={12} style={{ marginTop: "15px" }}>
            <h2>Mis compras</h2>
          </Col>
          {orderList.map((order, index) => (
            <Row key={order + index}>
              <Col xs={12}>
                <p>{formatDate(order.date)}</p>
              </Col>
              <Row>
                {order.items.map((item) => {
                  return (
                    <Col xs={12} key={item.code}>
                      <p>{item.code}</p>
                    </Col>
                  );
                })}
              </Row>
            </Row>
          ))}
        </Row>
      </Container>
    </>
  );
}
