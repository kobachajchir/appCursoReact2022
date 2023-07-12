import { lazy, Suspense, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams, Link } from "react-router-dom";
import { ItemCount } from "./ItemCount";
import { Col } from "react-bootstrap";

function Item(props) {
  const imgUrl = new URL(props.item.picture[0], import.meta.url).href;
  return (
    <Col
      xs={10}
      md={5}
      lg={3}
      className="card"
      key={props.index}
      style={{ margin: "5px" }}
    >
      <LazyLoadImage
        className="card-img-top"
        alt={props.item.code + "ProdImg"}
        src={imgUrl}
      />
      <div className="card-body">
        <h5 className="card-title">{props.item.title}</h5>
        <p className="card-text">{props.item.description}</p>
        <div className="col-12 row justify-content-center">
          <Link
            to={"/product/" + props.item.id}
            className="btn btn-primary seeProductInfo col-6"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </Col>
  );
}

export default Item;
