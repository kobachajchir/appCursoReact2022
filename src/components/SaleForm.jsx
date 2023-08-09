import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup, Row, Col } from "react-bootstrap";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import formatDateAndTime, { formatDate } from "../tools/formatDate";

export default function SaleForm({ sale, onSubmit, onClose }) {
  const [discountName, setDiscountName] = useState(sale ? sale.name : "");
  const [discountAvaliable, setDiscountAvailable] = useState(
    sale ? sale.discountAvaliable : 0
  );
  const [discountEnding, setDiscountEnding] = useState(
    sale ? sale.discountEnding : null
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    sale ? sale.discountPercentage : 0
  );
  const [selectedProducts, setSelectedProducts] = useState(
    sale ? sale.productElegibles : []
  );
  const [products, setProducts] = useState([]);

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
      setDiscountName(sale.name);
      setDiscountAvailable(sale.discountAvaliable);
      setDiscountEnding(formatDateAndTime(sale.discountEnding));
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

  const handleSaleSubmit = async () => {
    const discountEndingDate = new Date(discountEnding);
    const discountEndingTimestamp = Timestamp.fromDate(discountEndingDate);
    try {
      if (sale) {
        await updateDoc(doc(db, "sales", sale.id), {
          name: discountName,
          discountAvaliable,
          discountEnding: discountEndingTimestamp,
          discountPercentage,
          productElegibles: selectedProducts,
        });
        console.log("Sale document updated with ID: ", sale.id);
      } else {
        const docRef = await addDoc(collection(db, "sales"), {
          name: discountName,
          discountAvaliable,
          discountEnding: discountEndingTimestamp,
          discountPercentage,
          productElegibles: selectedProducts,
        });
        console.log("Sale document written with ID: ", docRef.id);
      }
      setDiscountName("");
      setDiscountAvailable(0);
      setDiscountEnding("");
      setDiscountPercentage(0);
      setSelectedProducts([]);
      onSubmit && onSubmit(); // Call onSubmit function if provided
    } catch (e) {
      console.error("Error adding or updating document: ", e);
    }
  };
  const inputStyles = {
    color: "var(--bs-body-color)",
    backgroundColor: "var(--bs-secondary-bg)",
    borderRadius: "var(--bs-border-radius)",
    border: "none",
    fontSize: "1.25rem",
    padding: "5px",
    textAlign: "center",
  };
  const labelStyles = {
    marginTop: "10px",
  };
  return (
    <div className="d-flex flex-column justify-content-center">
      {sale && (
        <Button variant="danger" onClick={onClose}>
          Cancelar edicion
        </Button>
      )}
      <Form>
        <Form.Group controlId="formDiscountName">
          <Form.Label style={labelStyles}>Nombre del descuento</Form.Label>
          <Form.Control
            style={inputStyles}
            type="text"
            value={discountName}
            onChange={(e) => setDiscountName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDiscountPercentage">
          <Form.Label style={labelStyles}>Porcentaje de descuento</Form.Label>
          <Form.Control
            style={inputStyles}
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
            min={0}
            max={100}
          />
        </Form.Group>
        <Form.Group controlId="formDiscountAvailable">
          <Form.Label style={labelStyles}>Cantidad de descuentos</Form.Label>
          <Form.Control
            style={inputStyles}
            type="number"
            value={discountAvaliable}
            onChange={(e) => setDiscountAvailable(e.target.value)}
            required
            min={0}
          />
        </Form.Group>
        <Form.Group controlId="formDiscountEnding">
          <Form.Label style={labelStyles}>
            Finalizacion del descuento
          </Form.Label>
          <Form.Control
            style={inputStyles}
            type="datetime-local"
            defaultValue={discountEnding}
            onChange={(e) => setDiscountEnding(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Label style={labelStyles}>Productos participantes</Form.Label>
        <ListGroup>
          {products &&
            products.map((product) => (
              <ListGroup.Item
                key={product.id}
                style={{
                  ...inputStyles,
                  marginTop: "2.5px",
                  marginBottom: "2.5px",
                }}
              >
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
        <Button
          variant="primary"
          onClick={handleSaleSubmit}
          style={{ marginTop: "15px" }}
        >
          {sale ? "Modificar" : "Agregar"} oferta
        </Button>
      </Form>
    </div>
  );
}
