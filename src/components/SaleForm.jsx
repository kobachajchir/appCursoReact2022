import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, Row, Col } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export default function SaleForm({ sale, onSubmit, onClose }) {
  const [discountAvaliable, setDiscountAvailable] = useState(
    sale ? sale.discountAvaliable : 0
  );
  const [discountEnding, setDiscountEnding] = useState(
    sale ? sale.discountEnding : ""
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    sale ? sale.discountPercentage : 0
  );
  const [selectedProducts, setSelectedProducts] = useState(
    sale ? sale.productElegibles : []
  );
  const [products, setProducts] = useState([]);

  const formatDate = (firebaseTimestamp) => {
    // convert Firestore timestamp to JavaScript Date object
    const jsDate = new Date(firebaseTimestamp.seconds * 1000);

    // format date to 'YYYY-MM-DDThh:mm' format
    const year = jsDate.getFullYear();
    const month =
      jsDate.getMonth() < 9
        ? `0${jsDate.getMonth() + 1}`
        : jsDate.getMonth() + 1; // JS months are 0-indexed
    const day =
      jsDate.getDate() < 10 ? `0${jsDate.getDate()}` : jsDate.getDate();
    const hours =
      jsDate.getHours() < 10 ? `0${jsDate.getHours()}` : jsDate.getHours();
    const minutes =
      jsDate.getMinutes() < 10
        ? `0${jsDate.getMinutes()}`
        : jsDate.getMinutes();
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  };

  const db = getFirestore();
  const fetchProducts = async () => {
    const data = await getDocs(collection(db, "products"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  useEffect(() => {
    fetchProducts().then((results) => {
      setProducts(results);
    });
  }, []);

  useEffect(() => {
    if (sale) {
      console.log(sale);
      setDiscountAvailable(sale.discountAvaliable);
      setDiscountEnding(sale.discountEnding);
      setDiscountPercentage(sale.discountPercentage);
      setSelectedProducts(sale.productElegibles);
    }
  }, [sale]);

  const handleProductSelect = (productCode) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productCode)) {
        // If already selected, remove from array
        return prevSelected.filter((code) => code !== productCode);
      } else {
        // If not selected, add to array
        return [...prevSelected, productCode];
      }
    });
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sale) {
        await updateDoc(doc(db, "sales", sale.id), {
          discountAvaliable,
          discountEnding,
          discountPercentage,
          productElegibles: selectedProducts,
        });
        console.log("Sale document updated with ID: ", sale.id);
      } else {
        const docRef = await addDoc(collection(db, "sales"), {
          discountAvaliable,
          discountEnding,
          discountPercentage,
          productElegibles: selectedProducts,
        });
        console.log("Sale document written with ID: ", docRef.id);
      }
      setDiscountAvailable(0);
      setDiscountEnding("");
      setDiscountPercentage(0);
      setSelectedProducts([]);
      onSubmit && onSubmit(); // Call onSubmit function if provided
    } catch (e) {
      console.error("Error adding or updating document: ", e);
    }
  };
  return (
    <>
      {sale && (
        <Button variant="danger" onClick={onClose}>
          Cancelar edicion
        </Button>
      )}
      <Form onSubmit={handleSaleSubmit}>
        <Form.Group controlId="formDiscountPercentage">
          <Form.Label>Porcentaje de descuento</Form.Label>
          <Form.Control
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            min={0}
            max={100}
          />
        </Form.Group>
        <Form.Group controlId="formDiscountAvailable">
          <Form.Label>Cantidad de descuentos</Form.Label>
          <Form.Control
            type="number"
            value={discountAvaliable}
            onChange={(e) => setDiscountAvailable(e.target.value)}
            required
            min={0}
          />
        </Form.Group>
        <Form.Group controlId="formDiscountEnding">
          <Form.Label>Finalizacion del descuento</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formatDate(discountEnding)}
            onChange={(e) => setDiscountEnding(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Label>Productos participantes</Form.Label>
        <ListGroup>
          {products &&
            products.map((product) => (
              <ListGroup.Item key={product.id}>
                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      id={`product-${product.id}`}
                      label={product.code}
                      onChange={() => handleProductSelect(product.code)}
                      checked={selectedProducts.includes(product.code)}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
        </ListGroup>
        <Button variant="primary" type="submit">
          {sale ? "Update" : "Add"} Sale
        </Button>
      </Form>
    </>
  );
}
