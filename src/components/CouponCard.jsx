import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import CouponForm from "./CouponForm";

export default function CouponCard({
  coupon,
  onModify,
  isEditing,
  setIsEditing,
}) {
  const handleModify = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = () => {
    setIsEditing(false);
  };

  return (
    <Card>
      <Card.Body>
        {!isEditing ? (
          <>
            <Card.Title>Code: {coupon.code}</Card.Title>
            <Card.Text>
              Discount Percentage: {coupon.discountPercentage}
            </Card.Text>
            <Card.Text>Amount Available: {coupon.amountAvailable}</Card.Text>
            <Button variant="primary" onClick={handleModify}>
              Modificar
            </Button>
          </>
        ) : (
          <CouponForm
            coupon={coupon}
            onSubmit={handleFormSubmit}
            onClose={() => setIsEditing(false)} // Modify this line
          />
        )}
      </Card.Body>
    </Card>
  );
}
