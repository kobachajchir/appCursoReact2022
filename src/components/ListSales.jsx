import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import SaleCard from "./SaleCard";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";
import SaleForm from "./SaleForm";

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
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  const fetchCoupons = async () => {
    const data = await getDocs(collection(db, "coupons"));
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  useEffect(() => {
    fetchSales().then(setSales);
    fetchCoupons().then(setCoupons);
  }, []);

  useEffect(() => {
    fetchSales().then(setSales);
  }, [isEditingSale]);

  useEffect(() => {
    fetchCoupons().then(setCoupons);
  }, [isEditingCoupon]);

  const handleModifySale = (saleId) => {
    setSelectedSale(sales.find((sale) => saleId === sale.id));
    setIsEditingSale(true);
  };

  const handleModifyCoupon = (couponId) => {
    setSelectedCoupon(coupons.find((coupon) => couponId === coupon.id));
    setIsEditingCoupon(true);
  };

  const handleFormSubmit = () => {
    setIsEditingSale(false);
    setIsEditingCoupon(false);
    setSelectedSale(null);
    setSelectedCoupon(null);
  };

  const saleForm = isEditingSale && selectedSale && (
    <SaleForm
      sale={selectedSale}
      onSubmit={handleFormSubmit}
      onClose={() => setIsEditingSale(false)}
    />
  );

  const couponForm = isEditingCoupon && selectedCoupon && (
    <CouponForm
      coupon={selectedCoupon}
      onSubmit={handleFormSubmit}
      onClose={() => setIsEditingCoupon(false)}
    />
  );

  return (
    <Container>
      {!isEditingCoupon && (
        <Row className="d-flex flex-row justify-content-center">
          <Col xs={12} style={{ marginBottom: "2.5px" }}>
            <h2>{isEditingSale ? "Modifying Offer" : "List of Offers"}</h2>
          </Col>
          <Col
            xs={12}
            lg="auto"
            className="d-flex flex-row justify-content-center"
          >
            {isEditingSale
              ? saleForm
              : sales.map((sale) => (
                  <div
                    key={sale.id}
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    <SaleCard sale={sale}>
                      <Button
                        variant="primary"
                        onClick={() => handleModifySale(sale.id)}
                      >
                        Modificar
                      </Button>
                    </SaleCard>
                  </div>
                ))}
          </Col>
        </Row>
      )}
      {!isEditingSale && (
        <Row className="d-flex flex-row justify-content-center">
          <Col xs={12} style={{ marginTop: "15px", marginBottom: "2.5px" }}>
            <h2>{isEditingCoupon ? "Modifying Coupon" : "List of Coupons"}</h2>
          </Col>
          <Col
            xs={12}
            lg="auto"
            className="d-flex flex-row justify-content-center"
          >
            {isEditingCoupon
              ? couponForm
              : coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    <CouponCard coupon={coupon}>
                      <Button
                        variant="primary"
                        onClick={() => handleModifyCoupon(coupon.id)}
                      >
                        Modificar
                      </Button>
                    </CouponCard>
                  </div>
                ))}
          </Col>
        </Row>
      )}
    </Container>
  );
}
