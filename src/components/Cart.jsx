import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
} from "react-bootstrap";
import {
  Cart2,
  Check,
  CheckCircleFill,
  ExclamationCircleFill,
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
import PaymentBrickComponent from "./PaymentBrick";
import { Payment } from "@mercadopago/sdk-react";
import { getFunctions, httpsCallable } from "firebase/functions";

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
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorPayment, setErrorPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [buyItems, setBuyItems] = useState();
  const [buyerData, setBuyerData] = useState({});
  const [coupon, setCoupon] = useState("");
  const db = getFirestore();
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const { isUserLogged: isUserLogged } = useContext(GeneralCompany);
  const [initialization, setInitialization] = useState({
    amount: 0,
    preferenceId: "",
  });

  useEffect(() => {}, []);
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
  const createPreferenceFunction = async () => {
    try {
      const func = getFunctions();
      const createPreference = httpsCallable(func, "createPreference");
      const result = await createPreference({});
      console.log(result);
      return result.data.preferenceId;
    } catch (error) {
      console.error("Error getting preference ID: ", error);
      throw error; // Or handle the error appropriately
    }
  };
  const customization = {
    visual: {
      style: {
        customVariables: {
          textPrimaryColor: "var(--bs-emphasis-color)",
          textSecondaryColor: "var(--bs-dark-text-emphasis)",
          inputBackgroundColor: "var(--bs-body-bg)",
          formBackgroundColor: "var(--bs-dark-bg-subtle)",
        },
      },
    },
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: ["wallet_purchase"],
      minInstallments: 0,
      maxInstallments: 12,
    },
  };
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // Envía los datos al endpoint /process_payment
    console.log(formData);
    fetch(
      "http://127.0.0.1:5001/pachacreaciones3d/us-central1/processPayment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setPaymentProcessed(true);
        if (data.status === "approved") {
          setErrorPayment(false);
          setBuyerData(formData);
          setBuyItems(cart);
          clear();
        } else {
          setErrorPayment(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorPayment(true);
      });
    setShowModal(false);
  };
  function onReady() {
    setDisabled(false);
  }
  function onError() {
    setErrorPayment(true);
  }
  return (
    <>
      <Container className="container">
        {!paymentProcessed && (
          <Row className="justify-content-center">
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
                          Total con cupon "{validatedCoupon.code.toUpperCase()}
                          ": ${totalWithDiscount - priceWithCoupon}
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
                        className={`${
                          !isLg ? "d-flex justify-content-end" : ""
                        }`}
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
                          <CheckOut
                            disabled={disabled}
                            onClick={async () => {
                              setDisabled(true);
                              try {
                                await createPreferenceFunction().then(
                                  (result) => {
                                    setInitialization({
                                      amount: validatedCoupon
                                        ? Number(
                                            totalWithDiscount - priceWithCoupon
                                          )
                                        : Number(totalWithDiscount),
                                      preferenceId: result,
                                    });
                                    setShowModal(true);
                                  }
                                );
                              } catch (error) {
                                console.error("Handled Error: ", error);
                              }
                            }}
                          />
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
        )}
        {paymentProcessed && errorPayment && (
          <Row className="d-flex justify-content-center align-items-center">
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <ExclamationCircleFill
                color="var(--bs-danger-text-emphasis)"
                size={80}
              />
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h3>Error de pago</h3>
            </Col>
          </Row>
        )}
        {paymentProcessed && !errorPayment && (
          <Row className="d-flex justify-content-center align-items-center">
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h2>Gracias por tu compra!</h2>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <CheckCircleFill
                color="var(--bs-success-text-emphasis)"
                size={80}
              />
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h3>Pago completado</h3>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h4>Artículos Comprados</h4>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <Accordion style={{ width: "60%" }}>
                {buyItems.map((product, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={product.item.id}
                  >
                    <Accordion.Header>
                      {product.quantity}x {product.item.title}
                    </Accordion.Header>
                    <Accordion.Body className="d-flex justify-content-center align-items-center text-center flex-column">
                      <Card.Text>
                        <strong>Código:</strong> {product.item.code}
                      </Card.Text>
                      <Card.Text>
                        <strong>Descripcion:</strong> {product.item.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>Precio:</strong> ${product.item.price}
                      </Card.Text>
                      <Card.Text>
                        <strong>Cantidad:</strong> {product.quantity}
                      </Card.Text>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h4>Informacion del pago</h4>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center text-center flex-column"
            >
              <p>Cantidad de pagos: {buyerData.installments}</p>
              <p>Precio de cuota: ${buyerData.transaction_amount}</p>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <h3>Nos contactaremos a: {buyerData.payer.email}</h3>
            </Col>
          </Row>
        )}
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pagar a traves de Mercado Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Payment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
