import React, { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { LazyLoadImage } from "react-lazy-load-image-component";
import RatingStar from "./RatingStar";
import FavoriteHeart from "./FavoriteHeart";
import { Link } from "react-router-dom";
import formatDateAndTime from "../tools/formatDate";

export default function UserOrders() {
  const { username } = useContext(GeneralCompany);
  const [orderList, setOrderList] = useState([]);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
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
            <Row
              key={order + index}
              style={{
                backgroundColor: "var(--bs-dark-bg-subtle)",
                color: "color: var(--bs-emphasis-color)",
                marginBottom: "25px",
              }}
              className="d-flex justify-content-center align-items-center text-center flex-column"
            >
              <Col xs={12}>
                <h4 style={{ marginTop: "15px" }}>
                  {formatDateAndTime(order.date)}
                </h4>
              </Col>
              <Accordion>
                {order.items.map((item, indx) => {
                  return (
                    <Accordion.Item
                      eventKey={indx}
                      xs={10}
                      as={Row}
                      className={`themeEmphasisBgColor d-flex align-items-center ${
                        !isLg
                          ? "flex-row"
                          : "flex-column justify-content-center text-center"
                      }`}
                      key={index}
                      style={{
                        backgroundColor: "var(--bs-secondary-bg)",
                        borderRadius: "var(--bs-border-radius)",
                        margin: "10px",
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      <Accordion.Header>{item.description}</Accordion.Header>
                      <Accordion.Body>
                        <>
                          <Row
                            as={Col}
                            xs={12}
                            lg={"auto"}
                            className="d-flex flex-column justify-content-center text-center"
                            style={{
                              transform: "translateY(5px)",
                            }}
                          >
                            <div
                              className="d-flex flex-row align-items-cente justify-content-center text-centerr"
                              style={{ justifyContent: "space-between" }}
                            ></div>
                            <p
                              className="card-text"
                              style={{ fontSize: "1.1rem" }}
                            >
                              {item.description}
                            </p>
                          </Row>
                          <Row
                            as={Col}
                            xs={12}
                            lg={"auto"}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <Row
                              className={`align-items-center justify-content-center text-center ${
                                !isLg ? "" : ""
                              }
                  }`}
                              style={{
                                margin: 0,
                                marginTop: isLg ? "15px" : 0,
                                marginBottom: isLg ? "15px" : 0,
                              }}
                            >
                              <Col xs={12} lg={"auto"}>
                                <p>Cantidad: {item.amount}</p>
                              </Col>
                            </Row>
                          </Row>
                          <Row
                            className="row justify-content-center"
                            as={Col}
                            xs={12}
                            lg={"auto"}
                          >
                            <Col className="text-center">
                              <Link
                                to={"/product/" + item.id}
                                className="btn btn-primary seeProductInfo"
                              >
                                Ver producto
                              </Link>
                            </Col>
                          </Row>
                        </>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </Row>
          ))}
        </Row>
      </Container>
    </>
  );
}
