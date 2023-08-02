import { Col, Row } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../styles/CartItem.css";
import { useEffect, useState } from "react";
import testImage from "./../assets/images/testProduct.jpg";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const iconSize = 20;

export default function CartItem({ product, quantity, sale = null }) {
  const [picture, setPicture] = useState(null);
  async function fetchProductImage() {
    const storage = getStorage();

    // Construct the path to the image file in Firebase Storage
    const imagePath = `appData/productImages/${product.code}/${product.code}_1.jpg`;

    // Create a reference to the file in Firebase Storage
    const imageRef = ref(storage, imagePath);

    // Get the download URL for the file
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
    }
  }
  useEffect(() => {
    fetchProductImage().then((pictureUrl) => {
      setPicture(pictureUrl);
    });
  }, []);
  const hasSale = sale !== null;
  const salePrice = hasSale
    ? product.price - (sale.discountPercentage * product.price) / 100
    : product.price;
  return (
    <>
      <Col xs="auto" className="align-self-center">
        <LazyLoadImage
          className="cartItemImg align-self-center"
          alt={product.code + "CartItem"}
          src={picture !== null && picture !== undefined ? picture : testImage}
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
