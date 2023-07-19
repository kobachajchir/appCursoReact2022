import { Col, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../styles/CartItem.css";
import { useEffect } from "react";

const iconSize = 20;

export default function CartItem({ product, quantity, sale = null }) {
  const imgUrl = new URL(product.picture[0], import.meta.url).href;
  const hasSale = sale !== null;
  const salePrice = hasSale
    ? product.price - (sale.discountPercentage * product.price) / 100
    : product.price;
  useEffect(() => {});
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
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>
          {product.title}
        </h4>
        <p style={{ margin: 0 }}>{product.description}</p>
        <p style={{ margin: 0 }}>
          ${product.price}{" "}
          <span style={{ color: "red", fontWeight: "600" }}>
            {hasSale ? `(-${sale.discountPercentage}%)` : null}
          </span>
        </p>
        <p style={{ margin: 0 }}>Quantity: {quantity}</p>
        <p style={{ margin: 0 }}>
          Subtotal: ${(salePrice * quantity).toFixed(2)}
        </p>
      </Col>
    </>
  );
}
