import { useState } from "react";
import Item from "./Item";
import { Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

export default function ItemList({ productos, favorites }) {
  return (
    <>
      {productos.map((product) => (
        <Item
          item={product}
          key={product.id}
          index={product.id}
          isFavorite={favorites.includes(product.code)}
        />
      ))}
    </>
  );
}
