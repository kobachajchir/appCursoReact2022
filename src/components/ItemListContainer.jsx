import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ItemFilter from "./ItemFilter";
import ItemList from "./ItemList";
export default function ItemListContainer(props) {
  const [prodList, setProdList] = useState([]);
  const [itemFilter, setItemFilter] = useState("Starred");
  const { idCat } = useParams();
  useEffect(() => {
    const db = getFirestore();
    let queryFilters;
    if (idCat) {
      queryFilters = query(
        collection(db, "products"),
        where("category", "==", idCat)
      );
    } else {
      queryFilters = collection(db, "products");
    }
    getDocs(queryFilters).then((snapshot) => {
      setProdList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      console.log("Productos filtrados por cat ", idCat);
      snapshot.docs.map((doc) => console.log(doc.id, " => ", doc.data()));
    });
  }, [idCat]);
  return (
    <>
      {idCat ? (
        <h1 className="text-center">{idCat}</h1>
      ) : (
        <>
          <Container>
            <Row className="text-center">
              <Col xs={12}>
                <ItemFilter filter={itemFilter} setFilter={setItemFilter} />
              </Col>
            </Row>
          </Container>
        </>
      )}
      <ItemList productos={prodList} />;
    </>
  );
}
