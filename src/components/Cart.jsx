import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
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
import { GeneralCompany } from "../App";
import LoginButton from "./LoginButton";

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
    validatedCoupon,
    priceWithCoupon,
    addValidatedCoupon,
  } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const db = getFirestore();
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const { isUserLogged: isUserLogged } = useContext(GeneralCompany);
  useEffect(() => {}, []);
  function createOrder() {
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
    navigate(`/order/1000`, { state: { ...order, id: "test123" } });
  }
  const fetchCoupons = async () => {
    const q = query(collection(db, "coupons"), where("code", "==", coupon));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return result[0];
  };
  function validarCupon() {
    fetchCoupons().then((result) => {
      console.log(result);
      if (result) {
        addValidatedCoupon(result);
      }
    });
  }
  function deleteCoupon() {
    addValidatedCoupon(null);
    setCoupon("");
  }
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    marginTop: "5px",
    marginBottom: "5px",
  };
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
                {!validatedCoupon && (
                  <Col
                    xs={12}
                    className="text-center"
                    style={{ marginTop: "15px", marginBottom: "15px" }}
                  >
                    <label
                      htmlFor="inputCoupon"
                      style={{ marginRight: "15px" }}
                    >
                      Tienes un cupon?
                    </label>
                    <input
                      type="text"
                      name="inputCoupon"
                      id="inputCoupon"
                      onChange={(e) => setCoupon(e.target.value)}
                      style={inputStyles}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={validarCupon}
                      style={{
                        marginLeft: "15px",
                        color: "var(--bs-body-color)",
                      }}
                    >
                      Validar cupon
                    </Button>
                  </Col>
                )}
                {validatedCoupon && (
                  <>
                    <Col xs={12} className="text-center">
                      <h5 style={{ margin: 0, color: "red" }}>
                        Descuentos del cupon: ${priceWithCoupon}
                      </h5>
                      <h3 style={{ marginTop: 0 }}>
                        Total con cupon "{validatedCoupon.code.toUpperCase()}":
                        ${totalWithDiscount - priceWithCoupon}
                      </h3>
                    </Col>
                    <Col xs={12} className="text-center">
                      <Button
                        variant="danger"
                        onClick={deleteCoupon}
                        style={{ marginTop: "5px", marginBottom: "20px" }}
                      >
                        Eliminar cupon
                      </Button>
                    </Col>
                  </>
                )}
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
                      {isUserLogged ? (
                        <CheckOut onClick={createOrder} />
                      ) : (
                        <LoginButton />
                      )}
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
                  borderRadius: "var(--bs-border-radius)",
                  backgroundColor: "var(--bs-dark-bg-subtle)",
                  color: "color: var(--bs-emphasis-color)",
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
