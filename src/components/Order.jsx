import { useEffect } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import GoHomeButton from "./GoHomeButton";
import GoHomeCart from "./GoHomeButton";
import OrderToTable from "./OrderToTable";

export default function Order() {
  const location = useLocation();
  const order = location.state;
  let formattedDate = new Date(order.date).toLocaleString().split(",")[0];
  console.log("Order: ", order);
  useEffect(() => {}, []);
  return (
    <>
      <OrderToTable order={order} />
    </>
  );
}
