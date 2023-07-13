import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ItemFilter from "./ItemFilter";
import ItemList from "./ItemList";
import { GeneralCompany } from "../App";

export default function ItemListContainer() {
  const [prodList, setProdList] = useState([]);
  const [itemFilter, setItemFilter] = useState({
    criteria: "none",
    order: "desc",
  });
  const { idCat } = useParams();
  const { productCategories: categories } = useContext(GeneralCompany);
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
  const filters = ["Nuevos", "Precio", "Mas comprados", "Valoracion"];
  const db = getFirestore();
  async function getAllProducts() {
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
    }
    const queryFilters =
      itemFilter.criteria === "none" || !filter
        ? collection(db, "products")
        : query(
            collection(db, "products"),
            orderBy(filter, itemFilter.order),
            limit(10)
          );
    const snapshot = await getDocs(queryFilters);
    const prods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(prods);
    return prods;
  }
  async function fetchFilteredProducts() {
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
    }

    let q;
    if (itemFilter.criteria === "none" || !filter) {
      q = query(
        collection(db, "products"),
        where("category", "==", idCat),
        limit(10)
      );
    } else {
      q = query(
        collection(db, "products"),
        where("category", "==", idCat),
        orderBy(filter, itemFilter.order),
        limit(10)
      );
    }

    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(products);
    return products;
  }
  useEffect(() => {
    if (!idCat) {
      getAllProducts().then((products) => setProdList(products));
    } else {
      fetchFilteredProducts().then((products) => setProdList(products));
    }
  }, [itemFilter, idCat]);
  return (
    <>
      <Container data-bs-theme="dark" fluid className="themeTerciaryBgColor">
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
                  marginTop: "5px",
                  marginBottom: "5px",
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
          <ItemList productos={prodList} />
        </Row>
      </Container>
    </>
  );
}
