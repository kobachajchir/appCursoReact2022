import React, { useState } from "react";
import { Carousel, Col, Image, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMediaQuery } from "react-responsive";

const CarouselWithThumbnails = (props) => {
  const [index, setIndex] = useState(0);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" }); // xs: screens less than 576px wide

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const imageUrls = props.item.images.map(
    (imagePath) => new URL(imagePath, import.meta.url).href
  );

  return (
    <Row
      as={Col}
      xs={12}
      lg={{ span: 6, offset: "auto" }}
      className={"justify-content-center"}
      style={{
        marginLeft: !isLg ? "auto" : "",
        marginRight: !isLg ? "auto" : "",
      }}
    >
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        as={Col}
        xs={10}
        lg={8}
      >
        {imageUrls.map((imageUrl, imageIndex) => (
          <Carousel.Item key={imageIndex}>
            <LazyLoadImage
              className="card-img-top"
              alt={props.item.code + "ProdImg" + imageIndex}
              src={imageUrl}
            />
            <Carousel.Caption>
              <h3>{"Image " + (imageIndex + 1)}</h3>
              <p>{"This is image " + (imageIndex + 1)}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Col
        xs={10}
        lg={2}
        className={`diferentImages ${
          isLg ? "d-flex justify-content-center" : ""
        }`}
        style={{ marginBottom: isLg ? "25px" : "" }}
      >
        {imageUrls.map((imageUrl, imageIndex) => (
          <Image
            key={imageIndex}
            src={imageUrl}
            onClick={() => handleSelect(imageIndex)}
            thumbnail
            style={{
              width: isLg ? "100px" : "auto",
              height: "auto",
              opacity: index === imageIndex ? 0.8 : 1,
            }}
          />
        ))}
      </Col>
    </Row>
  );
};

export default CarouselWithThumbnails;
