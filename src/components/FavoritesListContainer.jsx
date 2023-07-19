import { useCallback, useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GeneralCompany } from "../App";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Item from "./Item";
import ItemList from "./ItemList";
import FavoriteItem from "./FavoriteItem";
import { useMediaQuery } from "react-responsive";
import { HeartFill, Heartbreak } from "react-bootstrap-icons";
import GoHomeButton from "./GoHomeButton";

export default function FavoritesListContainer() {
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const { userFavorites: favorites, setUserFavorites: setUserFavorites } =
    useContext(GeneralCompany);
  const [prodList, setProdList] = useState([]);
  const [isEmpty, setEmpty] = useState(true);
  const db = getFirestore();
  async function fetchFavoriteProducts() {
    let filter = "favorites";
    const favoritesQuery = query(
      collection(db, "products"),
      where("code", "in", favorites)
    );
    const querySnapshot = await getDocs(favoritesQuery);
    let prods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return prods;
  }
  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteProducts().then((products) => setProdList(products));
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  }, [favorites]);
  return (
    <Container className="d-flex flex-column h-100 justify-content-center">
      {!isEmpty ? (
        <>
          {prodList.map((product) => (
            <Row
              className="align-items-center justify-content-center"
              key={product.id}
              style={{
                height: !isLg ? "25vh" : "unset",
                width: "auto",
              }}
            >
              <FavoriteItem item={product} index={product.id} />
            </Row>
          ))}
        </>
      ) : (
        <Row
          className="justify-content-center"
          style={{
            marginTop: "25px",
            marginBottom: "25px",
            backgroundColor: "var(--bs-secondary-bg)",
            borderRadius: "var(--bs-border-radius)",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <Col xs={12} lg={7} className="text-center">
            <Heartbreak size={100} />
          </Col>
          <Col xs={12} lg={7} className="text-center">
            <h3 style={{ marginTop: "10px", marginBottom: "25px" }}>
              No agregaste nada aun
            </h3>
          </Col>
          <Col xs={12} lg={7} className="text-center">
            <GoHomeButton />
          </Col>
        </Row>
      )}
    </Container>
  );
}
