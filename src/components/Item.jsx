import { lazy, Suspense, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams, Link } from "react-router-dom";
import { ItemCount } from "./ItemCount";
import { Col } from "react-bootstrap";
import { Heart, HeartFill, Star, StarFill } from "react-bootstrap-icons";
import FavoriteHeart from "./FavoriteHeart";
import testImage from "./../assets/images/testProduct.jpg";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import LoadingComponent from "./LoadingComponent";

function Item(props) {
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  async function fetchProductImage() {
    const storage = getStorage();

    // Construct the path to the image file in Firebase Storage
    const imagePath = `appData/productImages/${props.item.code}/${props.item.code}_1.jpg`;

    // Create a reference to the file in Firebase Storage
    const imageRef = ref(storage, imagePath);

    // Get the download URL for the file
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProductImage().then((pictureUrl) => {
      setPicture(pictureUrl);
      setLoading(false);
    });
  }, []);
  return (
    <Col
      xs={10}
      md={5}
      lg={3}
      className="card themeEmphasisBgColor"
      key={props.index}
      style={{ margin: "5px", padding: loading ? 0 : "" }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        {loading && <LoadingComponent text={"producto"} />}
        <div style={{ visibility: loading ? "hidden" : "visible" }}>
          <LazyLoadImage
            className="card-img-top"
            alt={props.item.code + "ProdImg"}
            src={
              picture !== null && picture !== undefined ? picture : testImage
            }
            style={{
              transform: "translateY(10px)",
              borderRadius: "var(--bs-card-inner-border-radius)",
              visibility: loading ? "hidden" : "visible",
            }}
          />
          <div
            className="card-body"
            style={{
              transform: "translateY(5px)",
            }}
          >
            <div
              className="d-flex flex-row align-items-center"
              style={{ justifyContent: "space-between" }}
            >
              <h5 className="card-title" style={{ margin: 0 }}>
                {props.item.title}
              </h5>
              <div className="d-flex flex-row align-items-center">
                <StarFill color="#CD9D00"></StarFill>
                <p
                  style={{ margin: 0, marginLeft: "1px", marginRight: "10px" }}
                >
                  {props.item.rating}
                </p>
                <FavoriteHeart
                  isFavorite={props.isFavorite}
                  productCode={props.item.code}
                ></FavoriteHeart>
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
        </div>
      </div>
    </Col>
  );
}

export default Item;
