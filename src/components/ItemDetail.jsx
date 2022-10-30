import { ItemCount } from "./ItemCount";
import "./../styles/ItemDetail.css";
import ToCartButton from "./ToCartButton";
import { Col, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect } from "react";

function ItemDetail(props) {
  const imgUrl = new URL(props.item.picture, import.meta.url).href;
  return (
    <>
      <Row>
        <Col xs={12} md={6} className="imageDetailContainer">
          <LazyLoadImage
            className="card-img-top"
            alt={props.item.code + "ProdImg"}
            src={imgUrl}
          />
        </Col>
        <Col className="itemDetailContainer" xs={12} md={6}>
          <h2 className="titleDetail">{props.item.title}</h2>
          <h5 className="priceDetail">${props.item.price}</h5>
          <p className="descriptionDetail">{props.item.description}</p>
          <p className="stockDetail">En stock: {props.item.stock}</p>
          <ItemCount product={props.item} />
        </Col>
      </Row>
    </>
  );
}

export default ItemDetail;
