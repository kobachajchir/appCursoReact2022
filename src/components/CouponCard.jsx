import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import CouponForm from "./CouponForm";

export default function CouponCard({ coupon, children, style }) {
  let username = null;
  const couponCode = () => {
    const match = String(coupon.code).match(/^usercoupon(.+)$/);
    if (match && match[1]) {
      username = match[1]; // Extracting the username
      return "Cupon de Usuario";
    }
    return coupon.code; // If not starting with "usercoupon", just return the original code.
  };
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
          <Card.Title>{couponCode()}</Card.Title>
          <Card.Subtitle>
            {isExpired && (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {" "}
                EXPIRADO
              </span>
            )}
          </Card.Subtitle>
          {username && (
            <Card.Text style={textStyles}>Usuario: {username}</Card.Text>
          )}
          <Card.Text style={textStyles}>
            Porcentaje de descuento: {coupon.discountPercentage}
          </Card.Text>
          <Card.Text style={textStyles}>
            Cantidad de cupones: {coupon.amountAvailable}
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
