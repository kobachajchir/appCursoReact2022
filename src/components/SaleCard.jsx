import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import SaleForm from "./SaleForm";
import { formatDate } from "../tools/formatDate";

export default function SaleCard({ sale, children }) {
  const textStyles = {
    margin: 0,
    marginTop: "5px",
    marginBottom: "5px",
  };
  return (
    <Card>
      <Card.Body>
        <>
          <Card.Title>{sale.name.toUpperCase()}</Card.Title>
          <Card.Text style={textStyles}>
            Fecha de finalizacion: {formatDate(sale.discountEnding)}
          </Card.Text>
          <Card.Text style={textStyles}>
            Descuentos disponibles: {sale.discountAvaliable}
          </Card.Text>
          <Card.Text style={textStyles}>
            Porcentaje de descuento: {sale.discountPercentage}
          </Card.Text>
          <Card.Text style={{ ...textStyles, marginBottom: "15px" }}>
            Productos participantes: {sale.productElegibles.join(", ")}
          </Card.Text>
          {children}
        </>
      </Card.Body>
    </Card>
  );
}
