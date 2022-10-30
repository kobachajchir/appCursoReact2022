import { addDoc, getFirestore } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Check, House, HouseFill, TrashFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartItem from "./CartItem";
import CartItemActions from "./CartItemActions";
import CheckOut from "./Checkout";
import GoHomeButton from "./GoHomeButton";

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
  } = useContext(CartContext);
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
    /*
    const db = getFirestore();
    const orderCollection = collection(db, "orders");
    addDoc(orderCollection, order).then(({ id }) => {
      orderId = id;
      console.log("Order created successfully", orderId);
    });*/
  }
  return (
    <>
      <Container className="container">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h1>Cart</h1>
          </Col>
          <div className="cartContainer">
            {cart.length > 0 ? (
              <>
                {cart.map((cartItem) => (
                  <Col xs={12}>
                    <Row className="justify-content-center">
                      <CartItem
                        key={`cartIem${cartItem.item.id}`}
                        product={cartItem.item}
                        quantity={cartItem.quantity}
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
                  <h3>Total: ${total}</h3>
                </Col>
                <Col xs={12} className="text-center">
                  <button className="btn btn-danger" onClick={clear}>
                    <TrashFill size={20} className="align-self-center" />
                    Clear Cart
                  </button>
                  <CheckOut onClick={createOrder} />
                </Col>
              </>
            ) : (
              <>
                <Col xs={12} className="text-center">
                  <h3>Your cart is empty</h3>
                </Col>
                <Col xs={12} className="text-center">
                  <GoHomeButton />
                </Col>
              </>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
}
