import { ItemCount } from "./ItemCount";
import "./../styles/ItemDetail.css";
import ToCartButton from "./ToCartButton";
import { Col, Row, Carousel, Container } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect, useState } from "react";
import CarouselWithThumbnails from "./CarouselWithThumbnails";
import { useMediaQuery } from "react-responsive";

function ItemDetail(props) {
  const [item, setItem] = useState(props.item);
  const [isOnSale, setIsOnSale] = useState(props.sale.isOnSale);
  const [salePrice, setSalePrice] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  useEffect(() => {
    setIsOnSale(props.sale.isOnSale);
    if (props.sale.isOnSale) {
      setSalePrice(
        item.price - (item.price * props.sale.discountPercentage) / 100
      );

      const timestamp = props.sale.discountEnding;
      const date = new Date(timestamp.seconds * 1000);

      const convertedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      console.log(convertedDate);

      setEndingDate(convertedDate.toLocaleDateString());
    }
  }, [props.sale.isOnSale]);

  return (
    <Container>
      <Row
        style={{ marginLeft: "10px", marginRight: "10px", marginTop: "10px" }}
      >
        <CarouselWithThumbnails
          item={{
            code: item.code,
            images: item.picture,
          }}
        />
        <Col
          className="itemDetailContainer text-center justify-content-center"
          style={{ marginLeft: !isLg ? "-90px" : "0px" }}
          xs={12}
          lg={6}
        >
          <h2 className="titleDetail">{item.title}</h2>
          <p className="descriptionDetail">{item.description}</p>
          {isOnSale ? (
            <>
              <div className="justify-content-center d-flex align-items-center">
                <h5
                  className="priceDetail"
                  style={{
                    textDecoration: "line-through",
                    marginRight: "10px",
                  }}
                >
                  ${item.price}
                </h5>
                <h5 className="priceDetail salePrice">${salePrice}</h5>
              </div>
              <div>
                <h5 style={{ marginLeft: "10px" }} className="promotionEnding">
                  Oferta valida hasta: {endingDate}
                </h5>
              </div>
            </>
          ) : (
            <h5 className="priceDetail">${item.price}</h5>
          )}
          <p className="stockDetail">En stock: {item.stock}</p>
          <ItemCount product={item} />
        </Col>
      </Row>
    </Container>
  );
}

export default ItemDetail;
