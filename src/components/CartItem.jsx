import { Col, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../styles/CartItem.css";

const iconSize = 20;

export default function CartItem({ product, quantity }) {
  const imgUrl = new URL(product.picture, import.meta.url).href;
  return (
    <>
      <Col xs="auto" className="align-self-center">
        <LazyLoadImage
          className="cartItemImg align-self-center"
          alt={product.code + "CartItem"}
          src={imgUrl}
        />
      </Col>
      <Col xs="auto">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <p>Quantity: {quantity}</p>
        <p>Subtotal: ${product.price * quantity}</p>
      </Col>
    </>
  );
}
