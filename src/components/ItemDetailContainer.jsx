import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import picture from "./../assets/images/testProduct.jpg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { Container, Row } from "react-bootstrap";

export default function ItemDetailContainer(props) {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState({
    isOnSale: false,
  }); // Declare sale state
  const { idProd } = useParams();

  async function fetchSalesData(prodCode) {
    const db = getFirestore();
    const q = query(
      collection(db, "sales"),
      where("productElegibles", "array-contains", prodCode)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size !== 0) {
      return {
        isOnSale: true,
        ...querySnapshot.docs[0].data(),
      };
    }
    return {
      isOnSale: false,
    };
  }

  useEffect(() => {
    const db = getFirestore();
    const prod = doc(db, "products", idProd);
    getDoc(prod).then((snapshot) => {
      setProduct({ id: snapshot.id, ...snapshot.data() });
      setLoading(false);
      fetchSalesData(snapshot.data().code).then((saleData) => {
        setSale(saleData); // Set the sale state here
      });
    });
  }, [loading]);

  return (
    <Container fluid>
      <Row>{!loading && <ItemDetail item={product} sale={sale} />}</Row>
    </Container>
  );
}
