import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import SaleCard from "./SaleCard";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";
import SaleForm from "./SaleForm";
import LoadingComponent from "./LoadingComponent";

export default function ListSales() {
  const [sales, setSales] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isEditingSale, setIsEditingSale] = useState(false);
  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
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
    Promise.all([fetchSales(), fetchCoupons()]).then(([sales, coupons]) => {
      setSales(sales);
      setCoupons(coupons);
      setLoading(false);
    });
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
        <Row
          className="d-flex flex-row justify-content-center"
          style={{
            marginBottom: loading ? "7.5vh" : "0",
          }}
        >
          <Col
            xs={12}
            style={{
              marginBottom: "2.5px",
              visibility: loading ? "hidden" : "visible",
            }}
          >
            <h2>
              {isEditingSale ? "Modificar ofertas" : "Listado de ofertas"}
            </h2>
          </Col>
          <Col
            xs={12}
            lg="auto"
            className="d-flex flex-row justify-content-center"
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            {isEditingSale ? (
              saleForm
            ) : loading ? (
              <LoadingComponent text={"ofertas"} />
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  style={{
                    marginLeft: "5px",
                    marginRight: "5px",
                    visibility: loading ? "hidden" : "visible",
                  }}
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
              ))
            )}
          </Col>
        </Row>
      )}
      {!isEditingSale && (
        <Row
          className="d-flex flex-row justify-content-center"
          style={{
            marginTop: loading ? "7.5vh" : "0",
          }}
        >
          <Col
            xs={12}
            style={{
              marginTop: "15px",
              marginBottom: "2.5px",
              visibility: loading ? "hidden" : "visible",
            }}
          >
            <h2>
              {isEditingCoupon ? "Modificar cupon" : "Listado de cupones"}
            </h2>
          </Col>
          <Col
            xs={12}
            lg="auto"
            className="d-flex flex-row justify-content-center"
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            {isEditingCoupon ? (
              couponForm
            ) : loading ? (
              <LoadingComponent text={"cupones"} />
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  style={{
                    marginLeft: "5px",
                    marginRight: "5px",
                    visibility: loading ? "hidden" : "visible",
                  }}
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
              ))
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
