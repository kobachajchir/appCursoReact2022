import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import SaleForm from "./SaleForm";

export default function SaleCard({ sale, onModify, isEditing, setIsEditing }) {
  const handleModify = () => {
    setIsEditing(true);
  };

  // add a new function
  const handleFormSubmit = () => {
    setIsEditing(false);
  };

  const formatDate = (firebaseTimestamp) => {
    // convert Firestore timestamp to JavaScript Date object
    const jsDate = new Date(firebaseTimestamp.seconds * 1000);

    // format date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(jsDate);

    return formattedDate;
  };

  return (
    <Card>
      <Card.Body>
        {!isEditing ? (
          <>
            <Card.Title>
              Descuentos disponibles: {sale.discountAvaliable}
            </Card.Title>
            <Card.Text>
              Fecha de finalizacion: {formatDate(sale.discountEnding)}
            </Card.Text>
            <Card.Text>
              Porcentaje de descuento: {sale.discountPercentage}
            </Card.Text>
            <Card.Text>
              Productos participantes: {sale.productElegibles.join(", ")}
            </Card.Text>
            <Button variant="primary" onClick={handleModify}>
              Modificar
            </Button>
          </>
        ) : (
          <SaleForm
            sale={sale}
            onSubmit={handleFormSubmit}
            onClose={() => setIsEditing(false)} // Modify this line
          />
        )}
      </Card.Body>
    </Card>
  );
}
