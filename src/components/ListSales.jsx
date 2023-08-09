import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col, Carousel } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import SaleCard from "./SaleCard";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";
import SaleForm from "./SaleForm";
import LoadingComponent from "./LoadingComponent";

export default function ListSales({
  sales,
  coupons,
  refreshCoupons,
  refreshSales,
  refreshCouponsFn,
  refreshSalesFn,
}) {
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isEditingSale, setIsEditingSale] = useState(false);
  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [sales, coupons]);

  const handleModifySale = (saleId) => {
    setSelectedSale(sales.find((sale) => saleId === sale.id));
    setIsEditingSale(true);
  };

  const handleModifyCoupon = (couponId) => {
    setSelectedCoupon(coupons.find((coupon) => couponId === coupon.id));
    setIsEditingCoupon(true);
  };

  const handleFormCouponSubmit = () => {
    setIsEditingCoupon(false);
    setSelectedCoupon(null);
    refreshCouponsFn(true);
  };

  const handleFormSaleSubmit = () => {
    setIsEditingSale(false);
    setSelectedSale(null);
    refreshSalesFn(true);
  };

  const saleForm = isEditingSale && selectedSale && (
    <SaleForm
      sale={selectedSale}
      onSubmit={handleFormSaleSubmit}
      onClose={() => setIsEditingSale(false)}
    />
  );

  const couponForm = isEditingCoupon && selectedCoupon && (
    <CouponForm
      coupon={selectedCoupon}
      onSubmit={handleFormCouponSubmit}
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
              <Carousel indicators={false} slide={false} interval={null}>
                {sales.map((sale, index) => (
                  <Carousel.Item key={sale.id}>
                    <div
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        visibility: loading ? "hidden" : "visible",
                      }}
                    >
                      <SaleCard
                        sale={sale}
                        style={{ backgroundColor: "var(--bs-dark-bg-subtle)" }}
                      >
                        <Button
                          variant="primary"
                          onClick={() => handleModifySale(sale.id)}
                        >
                          Modificar
                        </Button>
                      </SaleCard>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
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
              <Carousel indicators={false} slide={false} interval={null}>
                {coupons.map((coupon, index) => (
                  <Carousel.Item key={coupon.id}>
                    <div
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        visibility: loading ? "hidden" : "visible",
                      }}
                    >
                      <CouponCard
                        coupon={coupon}
                        style={{ backgroundColor: "var(--bs-dark-bg-subtle)" }}
                      >
                        <Button
                          variant="primary"
                          onClick={() => handleModifyCoupon(coupon.id)}
                        >
                          Modificar
                        </Button>
                      </CouponCard>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
