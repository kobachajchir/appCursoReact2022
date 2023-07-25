import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import SaleForm from "./SaleForm";
import CouponForm from "./CouponForm";

export default function AddSalesPanel() {
  return (
    <Container>
      <Tabs defaultActiveKey="coupon" id="uncontrolled-tab-example">
        <Tab eventKey="coupon" title="Agregar cupon">
          <CouponForm />
        </Tab>
        <Tab eventKey="sale" title="Agregar oferta">
          <SaleForm />
        </Tab>
      </Tabs>
    </Container>
  );
}
