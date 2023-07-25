import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import SaleCard from "./SaleCard";
import CouponCard from "./CouponCard";

export default function ListSales() {
  const [sales, setSales] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isEditingSale, setIsEditingSale] = useState(false);
  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const db = getFirestore();

  const fetchSales = async () => {
    const data = await getDocs(collection(db, "sales"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  const fetchCoupons = async () => {
    const data = await getDocs(collection(db, "coupons"));
    const results = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return results;
  };

  useEffect(() => {
    fetchSales().then((results) => {
      setSales(results);
    });
    fetchCoupons().then((results) => {
      setCoupons(results);
    });
  }, []);

  useEffect(() => {
    fetchSales().then((results) => {
      setSales(results);
    });
  }, [isEditingSale]);
  useEffect(() => {
    fetchCoupons().then((results) => {
      setCoupons(results);
    });
  }, [isEditingCoupon]);

  const handleModifySale = (sale) => {
    setSelectedSale(sale);
    setSelectedCoupon(null);
  };

  const handleModifyCoupon = (coupon) => {
    setSelectedSale(null);
    setSelectedCoupon(coupon);
  };

  return (
    <Container>
      {!isEditingCoupon && (
        <Row className="d-flex flex-row justify-content-center">
          <Col xs={12}>
            <h2>Listado de ofertas</h2>
          </Col>
          <Col xs={12} lg={"auto"}>
            {sales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                onModify={handleModifySale}
                isEditing={isEditingSale}
                setIsEditing={setIsEditingSale}
              />
            ))}
          </Col>
        </Row>
      )}
      {!isEditingSale && (
        <Row className="d-flex flex-row justify-content-center">
          <Col xs={12}>
            <h2>Listado de cupones</h2>
          </Col>
          <Col xs={12} lg={"auto"}>
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onModify={handleModifyCoupon}
                isEditing={isEditingCoupon}
                setIsEditing={setIsEditingCoupon}
              />
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
}
