import { useEffect } from "react";
import { useContext, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import { CartContext } from "../context/CartContext";
import "./../styles/ItemCount.css";
import ToCartButton from "./ToCartButton";
import { ProductCountButton } from "./ProductCountButton";

export function ItemCount({ product, isOnSale, sale }) {
  const { cart, addItem, isInCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const handleMinusOne = () => {
    quantity > 1 && setQuantity(quantity - 1);
  };
  const handlePlusOne = () => {
    quantity < product.stock && setQuantity(quantity + 1);
  };
  useEffect(() => {
    if (isInCart(product.id)) {
      setAddedToCart(true);
    }
  }, [cart]);
  return (
    <div id={"itemCounter" + product.id}>
      {addedToCart == false && product.stock > 0 && (
        <>
          <div className="w-100"></div>
          <Row className="justify-content-center">
            <Col
              xs={6}
              lg={3}
              lg-offset={2}
              className="input-group-prepend row justify-content-center justify-items-center"
              style={{ marginRight: "10px" }}
            >
              <ProductCountButton
                stock={product.stock}
                quantity={quantity}
                setQuantity={setQuantity}
                isMinus
              />
              <label className="col text-center form-control">{quantity}</label>
              <ProductCountButton
                stock={product.stock}
                quantity={quantity}
                setQuantity={setQuantity}
                isPlus
              />
            </Col>
            <Col
              xs={8}
              lg={5}
              lg-offset={2}
              className="row justify-content-center justify-items-center"
            >
              <a
                className="btn btn-danger addToCart"
                onClick={() => {
                  addItem(product, quantity, isOnSale, sale);
                  setAddedToCart(true);
                }}
              >
                Agregar al carrito
              </a>
            </Col>
          </Row>
        </>
      )}
      {addedToCart && (
        <Row as={Col} xs={3} className="justify-content-center">
          <ToCartButton />
        </Row>
      )}
      {product.stock <= 0 && (
        <Row as={Col} xs={3} className="justify-content-center">
          <Col>
            <Button variant="danger" disabled>
              No hay stock
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
}
