import { lazy, Suspense, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams, Link } from "react-router-dom";
import { ItemCount } from "./ItemCount";
import { Col } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

function Item(props) {
  const imgUrl = new URL(props.item.picture[0], import.meta.url).href;
  return (
    <Col
      xs={10}
      md={5}
      lg={3}
      className="card themeEmphasisBgColor"
      key={props.index}
      style={{ margin: "5px" }}
      data-bs-theme="dark"
    >
      <LazyLoadImage
        className="card-img-top"
        alt={props.item.code + "ProdImg"}
        src={imgUrl}
      />
      <div className="card-body">
        <div
          className="d-flex flex-row align-items-center"
          style={{ justifyContent: "space-between" }}
        >
          <h5 className="card-title" style={{ margin: 0 }}>
            {props.item.title}
          </h5>
          <div className="d-flex flex-row align-items-center">
            <StarFill color="#CD9D00"></StarFill>
            <p style={{ margin: 0 }}>{props.item.rating}</p>
          </div>
        </div>
        <p className="card-text">{props.item.description}</p>
        <div className="row justify-content-center">
          <Col xs={10} className="text-center">
            <Link
              to={"/product/" + props.item.id}
              className="btn btn-primary seeProductInfo"
            >
              Ver producto
            </Link>
          </Col>
        </div>
      </div>
    </Col>
  );
}

export default Item;
