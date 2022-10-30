import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import picture from "./../assets/images/testProduct.jpg";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function ItemDetailContainer(props) {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const { idProd } = useParams();
  useEffect(() => {
    const db = getFirestore();
    const prod = doc(db, "products", idProd);
    getDoc(prod).then((snapshot) => {
      setProduct({ id: snapshot.id, ...snapshot.data() });
      setLoading(false);
    });
  }, [loading]);
  return <div className="row">{!loading && <ItemDetail item={product} />}</div>;
}
