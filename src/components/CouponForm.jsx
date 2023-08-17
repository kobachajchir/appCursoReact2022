import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export default function CouponForm({
  coupon,
  onSubmit,
  onClose,
  username,
  modifying,
}) {
  const [code, setCode] = useState(
    coupon ? coupon.code : username && `usercoupon${username}`
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    coupon ? coupon.discountPercentage : 0
  );
  const [amountAvailable, setAmountAvailable] = useState(
    coupon ? coupon.amountAvailable : username && 1
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
    const db = getFirestore();

    const newCoupon = {
      code: code, // from local state
      discountPercentage: parseFloat(discountPercentage), // from local state and parsed to a float
      amountAvailable: parseInt(amountAvailable), // from local state and parsed to an int
      amountRedeem: 0, // initializing to 0, as this seems logical for a new coupon
    };

    try {
      // Query the `coupons` collection for documents with the given `code` attribute
      const q = query(collection(db, "coupons"), where("code", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a document with the given code exists, update it
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, newCoupon);
        console.log(`Document with code ${code} updated!`);
      } else {
        // Otherwise, add a new document
        const docRef = await addDoc(collection(db, "coupons"), newCoupon);
        console.log("Document written with ID: ", docRef.id);
      }

      // Clearing the form (optional)
      setCode("");
      setDiscountPercentage(0);
      setAmountAvailable(0);

      // Call the onSubmit function if provided (this is from your earlier code)
      onSubmit && onSubmit();
      !onSubmit && onClose();
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {coupon && (
        <Button variant="danger" onClick={onClose}>
          Cancelar edicion
        </Button>
      )}
      <Form
        className="d-flex justify-content-center flex-column"
        style={{ width: "75%" }}
      >
        <Form.Group
          controlId="formCode"
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Form.Label style={labelStyles}>Código del cupón</Form.Label>
          {code && code.includes("usercoupon") ? (
            <Form.Label style={{ ...labelStyles, fontSize: "1.25rem" }}>
              {"usercoupon"}
              <strong>{String(code).slice("usercoupon".length)}</strong>
            </Form.Label>
          ) : (
            <Form.Control
              style={inputStyles}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          )}
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
        <Form.Group
          controlId="formAmountAvailable"
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Form.Label style={labelStyles}>Cantidad de cupones</Form.Label>
          {code && code.includes("usercoupon") ? (
            <Form.Label style={{ ...labelStyles, fontSize: "1.25rem" }}>
              1
            </Form.Label>
          ) : (
            <Form.Control
              style={inputStyles}
              type="number"
              value={amountAvailable}
              onChange={(e) => setAmountAvailable(e.target.value)}
              required
              min={0}
            />
          )}
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
