import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ItemFilter from "./ItemFilter";
import ItemList from "./ItemList";
import { GeneralCompany } from "../App";

export default function ItemListContainer() {
  let startAt = 0;
  const [prodList, setProdList] = useState([]);
  const [itemFilter, setItemFilter] = useState({
    criteria: "none",
    order: "desc",
  });
  const { idCat } = useParams();
  const {
    productCategories: categories,
    isUserLogged: isUserLogged,
    username: username,
    userFavorites: favorites,
    setUserFavorites: setUserFavorites,
  } = useContext(GeneralCompany);
  const title = () => {
    let titleName = ""; // Initialize an empty string to hold the title name

    categories.forEach((cat) => {
      if (cat.subcategories) {
        const matchedSubcategory = cat.subcategories.find(
          (sub) => sub.code === idCat
        );
        if (matchedSubcategory) {
          titleName = matchedSubcategory.name; // Assign the name to titleName
        }
      }
      if (cat.id === idCat) {
        titleName = cat.name; // Assign the name to titleName
      }
    });

    return titleName; // Return the title name
  };
  const filters = [
    "Nuevos",
    "Precio",
    "Mas comprados",
    "Valoracion",
    "Favoritos",
  ];
  const db = getFirestore();
  async function fetchProducts(idCat) {
    let filter;
    switch (itemFilter.criteria) {
      case "Nuevos":
        filter = "createdOn";
        break;
      case "Precio":
        filter = "price";
        break;
      case "Mas comprados":
        filter = "amountSelled";
        break;
      case "Valoracion":
        filter = "rating";
        break;
      case "Favoritos":
        filter = "favorites";
        break;
    }
    let q;
    if (itemFilter.criteria === "none" || !filter || filter === "favorites") {
      q = query(collection(db, "products"), limit(10));
      if (idCat) {
        q = query(
          collection(db, "products"),
          where("category", "==", idCat),
          limit(10)
        );
      }
    } else {
      q = query(
        collection(db, "products"),
        orderBy(filter, itemFilter.order),
        limit(10)
      );
      if (idCat) {
        q = query(
          collection(db, "products"),
          where("category", "==", idCat),
          orderBy(filter, itemFilter.order),
          limit(10)
        );
      }
    }
    const querySnapshot = await getDocs(q);
    let prods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (filter === "favorites") {
      const favoritesBatch = favorites.slice(startAt, startAt + 10);
      console.log(favorites);
      prods = prods.filter((product) => favoritesBatch.includes(product.code));
    }
    if (itemFilter.order === "desc" || filter !== "favorites") {
      return prods;
    } else {
      return prods.reverse();
    }
  }
  useEffect(() => {
    fetchProducts(idCat).then((products) => setProdList(products));
  }, [itemFilter, idCat]);
  return (
    <>
      <Container fluid className="themeTerciaryBgColor">
        <Row className="justify-content-center text-center">
          <Col xs={12}>
            {idCat ? (
              <h1 className="text-center catTitle">{title()}</h1>
            ) : (
              <h1 className="text-center catTitle">Todos los productos</h1>
            )}
          </Col>
        </Row>
        <Row className="text-center">
          <Col xs={12} className="d-flex flex-row  justify-content-center">
            <ItemFilter
              itemFilter={itemFilter}
              setFilter={setItemFilter}
              filters={filters}
            />
          </Col>
          {itemFilter.criteria !== "none" ? (
            <Col xs={12}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                Filtrando por: {itemFilter.criteria}
                {itemFilter.order === "desc"
                  ? " (Descendente)"
                  : " (Ascendente)"}
              </h3>
            </Col>
          ) : null}
        </Row>
        <Row className="justify-content-center">
          <ItemList productos={prodList} favorites={favorites} />
        </Row>
      </Container>
    </>
  );
}
