import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import CouponForm from "./CouponForm";

export default function CouponCard({ coupon, children, style }) {
  const textStyles = {
    margin: 0,
    marginTop: "5px",
    marginBottom: "5px",
  };
  const isExpired =
    Number(coupon.amountRedeem) === Number(coupon.amountAvailable);
  return (
    <Card style={style}>
      <Card.Body>
        <>
          <Card.Title>{coupon.code}</Card.Title>
          <Card.Subtitle>
            {isExpired && (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {" "}
                EXPIRADO
              </span>
            )}
          </Card.Subtitle>
          <Card.Text style={textStyles}>
            Porcentaje de descuento: {coupon.discountPercentage}
          </Card.Text>
          <Card.Text style={textStyles}>
            Cantidad restante: {coupon.amountAvailable}
          </Card.Text>
          <Card.Text style={{ ...textStyles, marginBottom: "15px" }}>
            Cantidad canjeados: {coupon.amountRedeem}
          </Card.Text>
          {children}
        </>
      </Card.Body>
    </Card>
  );
}
