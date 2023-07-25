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

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
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
    <>
      {coupon && (
        <Button variant="danger" onClick={onClose}>
          Cancelar edicion
        </Button>
      )}
      <Form onSubmit={handleCouponSubmit}>
        <Form.Group controlId="formCode">
          <Form.Label>Código del cupón</Form.Label>
          <Form.Control
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Form.Group>
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
        <Form.Group controlId="formAmountAvailable">
          <Form.Label>Cantidad de cupones</Form.Label>
          <Form.Control
            type="number"
            value={amountAvailable}
            onChange={(e) => setAmountAvailable(e.target.value)}
            required
            min={0}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {coupon ? "Update" : "Add"} Coupon
        </Button>
      </Form>
    </>
  );
}
