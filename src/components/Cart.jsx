import { addDoc, getFirestore } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Cart2,
  Check,
  House,
  HouseFill,
  TrashFill,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartItem from "./CartItem";
import CartItemActions from "./CartItemActions";
import CheckOut from "./Checkout";
import GoHomeButton from "./GoHomeButton";
import { useMediaQuery } from "react-responsive";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    addItem,
    removeItem,
    clear,
    isInCart,
    buyCart,
    total,
    quantity,
    saleDiscount,
    totalWithDiscount,
  } = useContext(CartContext);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  useEffect(() => {
    console.log(cart);
  }, []);
  function createOrder() {
    console.log("Creando orden");
    let orderId;
    const orderDetails = buyCart();
    const items = orderDetails.items;
    const order = {
      buyer: {
        username: "Koba",
        userPhone: "3884889973",
        userAddress: {
          street: "Calle falsa",
          city: "CABA",
          state: "CABA",
          postalCode: "1234",
          apartment: "B",
          floor: "3",
          number: "1234",
          mapLocation: [-31.38576, -58.02267],
        },
      },
      items: items,
      date: new Date().toDateString(),
      total: total,
    };
    console.log("Order: ", order);
    navigate(`/order/1000`, { state: { ...order, id: "test123" } });
  }
  return (
    <>
      <Container className="container">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h1></h1>
          </Col>
          <div className="cartContainer">
            {cart.length > 0 ? (
              <Row className="justify-content-center">
                <Col xs={12} lg={4} className="text-center">
                  <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>
                    Resumen de compra
                  </h3>
                </Col>
                {cart.map((cartItem) => (
                  <Col xs={12}>
                    <Row
                      className="justify-content-center"
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <CartItem
                        key={`cartItem${cartItem.item.id}`}
                        product={cartItem.item}
                        quantity={cartItem.quantity}
                        sale={cartItem.item.sale}
                      />
                      <CartItemActions
                        key={`cartItemActions${cartItem.item.id}`}
                        product={cartItem.item}
                        quantity={cartItem.quantity}
                      />
                    </Row>
                  </Col>
                ))}
                <Col xs={12} className="text-center">
                  {saleDiscount !== 0 && (
                    <>
                      <h5 style={{ margin: 0 }}>Subtotal: ${total}</h5>
                      <h5 style={{ margin: 0, color: "red" }}>
                        Descuentos: ${saleDiscount}
                      </h5>
                    </>
                  )}
                  <h3 style={{ marginTop: "10px" }}>
                    Total: ${totalWithDiscount}
                  </h3>
                </Col>
                <Col xs={12} className="text-center">
                  <Row className="justify-content-center">
                    <Col
                      xs={12}
                      lg={4}
                      className={`${!isLg ? "d-flex justify-content-end" : ""}`}
                    >
                      <button
                        className="btn btn-danger"
                        onClick={clear}
                        style={{ marginBottom: isLg ? "10px" : 0 }}
                      >
                        Eliminar carrito
                      </button>
                    </Col>
                    <Col
                      xs={12}
                      lg={4}
                      className={`${
                        !isLg ? "d-flex justify-content-start" : ""
                      }`}
                    >
                      <CheckOut onClick={createOrder} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              <Row
                className="justify-content-center"
                style={{
                  marginTop: "25px",
                  marginBottom: "25px",
                  backgroundColor: "var(--bs-secondary-bg)",
                  borderRadius: "var(--bs-border-radius)",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                <Col xs={12} lg={7} className="text-center">
                  <Cart2 size={100} />
                </Col>
                <Col xs={12} lg={7} className="text-center">
                  <h3 style={{ marginTop: "10px", marginBottom: "25px" }}>
                    No agregaste nada aun
                  </h3>
                </Col>
                <Col xs={12} lg={7} className="text-center">
                  <GoHomeButton />
                </Col>
              </Row>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
}
