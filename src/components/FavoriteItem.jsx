import { Col, Row } from "react-bootstrap";
import { HeartFill, StarFill } from "react-bootstrap-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import RatingStar from "./RatingStar";
import FavoriteHeart from "./FavoriteHeart";
import { useMediaQuery } from "react-responsive";

export default function FavoriteItem(props) {
  const imgUrl = new URL(props.item.picture[0], import.meta.url).href;
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  return (
    <Col
      xs={10}
      as={Row}
      className={`themeEmphasisBgColor d-flex align-items-center ${
        !isLg ? "flex-row" : "flex-column justify-content-center text-center"
      }`}
      key={props.index}
      style={{
        backgroundColor: "var(--bs-secondary-bg)",
        borderRadius: "var(--bs-border-radius)",
        margin: "10px",
        paddingTop: "15px",
        paddingBottom: "15px",
      }}
    >
      <Row
        as={Col}
        xs={12}
        lg={"auto"}
        className="justify-content-center text-center"
      >
        <LazyLoadImage
          className=""
          alt={props.item.code + "ProdImg"}
          src={imgUrl}
          style={{
            borderRadius: "var(--bs-border-radius)",
            height: "20vh",
            width: "auto",
          }}
        />
      </Row>
      <Row
        as={Col}
        xs={12}
        lg={"auto"}
        className="d-flex flex-column justify-content-center text-center"
        style={{
          transform: "translateY(5px)",
        }}
      >
        <div
          className="d-flex flex-row align-items-cente justify-content-center text-centerr"
          style={{ justifyContent: "space-between" }}
        >
          <h5
            className="card-title"
            style={{ margin: 0, marginBottom: "15px", fontSize: "2rem" }}
          >
            {props.item.title}
          </h5>
        </div>
        <p className="card-text" style={{ fontSize: "1.1rem" }}>
          {props.item.description}
        </p>
      </Row>
      <Row
        as={Col}
        xs={12}
        lg={"auto"}
        className="d-flex align-items-center justify-content-center"
      >
        <Row
          className={`align-items-center justify-content-center text-center ${
            !isLg ? "" : ""
          }
      }`}
          style={{
            margin: 0,
            marginTop: isLg ? "15px" : 0,
            marginBottom: isLg ? "15px" : 0,
          }}
        >
          <Col xs={3} lg={"auto"}>
            <RatingStar rating={props.item.rating} size={30}></RatingStar>
          </Col>
          <Col xs={3} lg={"auto"}>
            <FavoriteHeart
              isFavorite={true}
              size={30}
              productCode={props.item.code}
            ></FavoriteHeart>
          </Col>
        </Row>
      </Row>
      <Row className="row justify-content-center" as={Col} xs={12} lg={"auto"}>
        <Col className="text-center">
          <Link
            to={"/product/" + props.item.id}
            className="btn btn-primary seeProductInfo"
          >
            Ver producto
          </Link>
        </Col>
      </Row>
    </Col>
  );
}