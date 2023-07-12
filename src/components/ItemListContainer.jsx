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
import { FirebaseConfigContext } from "../App";

export default function ItemListContainer(props) {
  const [prodList, setProdList] = useState([]);
  const [itemFilter, setItemFilter] = useState({
    criteria: "none",
    order: "desc",
  });
  const { idCat } = useParams();
  const filters = ["Nuevos", "Precio", "Mas comprados", "Valoracion"];
  const db = getFirestore();
  const firebaseConfig = useContext(FirebaseConfigContext);
  useEffect(() => {
    let queryFilters;
    if (idCat) {
      queryFilters = query(
        collection(db, "products"),
        where("category", "==", idCat)
      );
      console.log("Productos filtrados por cat ", idCat);
    } else {
      queryFilters = collection(db, "products");
    }
    getDocs(queryFilters).then((snapshot) => {
      setProdList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      snapshot.docs.map((doc) => console.log(doc.id, " => ", doc.data()));
    });
  }, [idCat]);
  useEffect(() => {
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
      try {
        if (!filter) {
          throw new Error("Filter is not defined");
        }
        const q = query(
          collection(db, "products"),
          orderBy(filter, itemFilter.order),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(products);
        return products;
      } catch (error) {
        return []; // Return an empty array in case of error
      }
    }
    fetchFilteredProducts().then((products) => setProdList(products));
  }, [itemFilter]);
  return (
    <>
      {idCat ? (
        <h1 className="text-center">{idCat}</h1>
      ) : (
        <>
          <Container>
            <Row className="text-center">
              <Col xs={12}>
                <ItemFilter
                  itemFilter={itemFilter}
                  setFilter={setItemFilter}
                  filters={filters}
                />
              </Col>
              <Col xs={12}>
                {itemFilter.criteria !== "none" ? (
                  <h3>
                    Filtrando por: {itemFilter.criteria}{" "}
                    {itemFilter.order === "desc"
                      ? "(Descendente)"
                      : "(Ascendente)"}
                  </h3>
                ) : (
                  <h3>Sin filtrado</h3>
                )}
              </Col>
            </Row>
          </Container>
        </>
      )}
      <ItemList productos={prodList} />;
    </>
  );
}
