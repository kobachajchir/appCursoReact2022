import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export default function CouponForm({ coupon, onSubmit, onClose }) {
  const [code, setCode] = useState(coupon ? coupon.code : "");
  const [discountPercentage, setDiscountPercentage] = useState(
    coupon ? coupon.discountPercentage : 0
  );
  const [amountAvailable, setAmountAvailable] = useState(
    coupon ? coupon.amountAvailable : 0
  );
  const db = getFirestore();

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setDiscountPercentage(coupon.discountPercentage);
      setAmountAvailable(coupon.amountAvailable);
    }
  }, [coupon]);
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
  const handleCouponSubmit = async () => {
    console.log("submit");
    try {
      if (coupon) {
        await updateDoc(doc(db, "coupons", coupon.id), {
          code,
          discountPercentage,
          amountAvailable,
        });
        console.log("Coupon document updated with ID: ", coupon.id);
      } else {
        const docRef = await addDoc(collection(db, "coupons"), {
          code,
          discountPercentage,
          amountAvailable,
        });
        console.log("Coupon document written with ID: ", docRef.id);
      }
      setCode("");
      setDiscountPercentage(0);
      setAmountAvailable(0);
      onSubmit && onSubmit(); // Call onSubmit function if provided
    } catch (e) {
      console.error("Error adding or updating document: ", e);
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center">
      {coupon && (
        <Button variant="danger" onClick={onClose}>
          Cancelar edicion
        </Button>
      )}
      <Form>
        <Form.Group controlId="formCode">
          <Form.Label style={labelStyles}>Código del cupón</Form.Label>
          <Form.Control
            style={inputStyles}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
        <Form.Group controlId="formAmountAvailable">
          <Form.Label style={labelStyles}>Cantidad de cupones</Form.Label>
          <Form.Control
            style={inputStyles}
            type="number"
            value={amountAvailable}
            onChange={(e) => setAmountAvailable(e.target.value)}
            required
            min={0}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleCouponSubmit}
          style={{ marginTop: "15px" }}
        >
          {coupon ? "Modificar" : "Agregar"} cupon
        </Button>
      </Form>
    </div>
  );
}
