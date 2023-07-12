import { useState } from "react";
import Item from "./Item";
import { Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

export default function ItemList({ productos }) {
  return (
    <Container className="cardContainer" fluid>
      <Row className="justify-content-center">
        {productos.map((product) => (
          <Item item={product} key={product.id} index={product.id} />
        ))}
      </Row>
    </Container>
  );
}
