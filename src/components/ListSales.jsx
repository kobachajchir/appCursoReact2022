import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col, Carousel } from "react-bootstrap";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import SaleCard from "./SaleCard";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";
import SaleForm from "./SaleForm";
import LoadingComponent from "./LoadingComponent";
import {
  EraserFill,
  PencilFill,
  Trash3Fill,
  X,
  XCircleFill,
  XOctagonFill,
} from "react-bootstrap-icons";

export default function ListSales({
  sales,
  coupons,
  userCoupons,
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
  const [showUserCoupon, setShowUserCoupon] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, [sales, coupons]);

  const handleModifySale = (saleId) => {
    setSelectedSale(sales.find((sale) => saleId === sale.id));
    setIsEditingSale(true);
  };

  const handleModifyCoupon = (couponId) => {
    let couponToModify = coupons.find((coupon) => couponId === coupon.id);
    if (!couponToModify && userCoupons) {
      couponToModify = userCoupons.find((coupon) => couponId === coupon.id);
    }
    if (couponToModify) {
      setSelectedCoupon(couponToModify);
      setIsEditingCoupon(true);
    } else {
      console.warn(`Coupon with ID ${couponId} was not found.`);
    }
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

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
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

  const db = getFirestore();

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteDoc(doc(db, "sales", saleId));
      refreshSalesFn(true);
      // If you have any local state containing the list of sales, you should also remove the sale from that state here.
    } catch (error) {
      console.error("Error deleting sale document:", error);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteDoc(doc(db, "coupons", couponId));
      refreshCouponsFn(true);

      // If you have any local state containing the list of coupons, you should also remove the coupon from that state here.
    } catch (error) {
      console.error("Error deleting coupon document:", error);
    }
  };

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
                        <div className="d-flex flex-row justify-content-evenly">
                          <button
                            style={{
                              background: "transparent",
                              color: "var(--bs-emphasis-color)",
                            }}
                            onClick={() => handleModifySale(sale.id)}
                          >
                            {" "}
                            <PencilFill />
                          </button>
                          <button
                            style={{
                              background: "transparent",
                              color: "var(--bs-emphasis-color)",
                            }}
                            onClick={() => handleDeleteSale(coupon.id)}
                          >
                            {" "}
                            <Trash3Fill />
                          </button>
                        </div>
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
              {isEditingCoupon
                ? "Modificar cupon"
                : showUserCoupon
                ? "Listado de cupones (Usuarios)"
                : "Listado de cupones (Tienda)"}
            </h2>
          </Col>
          <Col
            xs={12}
            lg="auto"
            className="d-flex flex-column justify-content-center"
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
              <div className="d-flex justify-content-center align-items-center flex-column">
                <Button
                  onClick={() => {
                    setShowUserCoupon(!showUserCoupon);
                    setCurrentIndex(0);
                  }}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {showUserCoupon
                    ? "Ver cupones de tienda"
                    : "Ver cupones de usuario"}
                </Button>
                {showUserCoupon ? (
                  <Carousel
                    indicators={false}
                    slide={false}
                    interval={null}
                    activeIndex={currentIndex}
                    onSelect={handleSelect}
                  >
                    {userCoupons.map((coupon, index) => (
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
                            style={{
                              backgroundColor: "var(--bs-dark-bg-subtle)",
                            }}
                          >
                            <div className="d-flex flex-row justify-content-evenly">
                              <button
                                style={{
                                  background: "transparent",
                                  color: "var(--bs-emphasis-color)",
                                }}
                                onClick={() => handleModifyCoupon(coupon.id)}
                              >
                                <PencilFill />
                              </button>
                              <button
                                style={{
                                  background: "transparent",
                                  color: "var(--bs-emphasis-color)",
                                }}
                                onClick={() => handleDeleteCoupon(coupon.id)}
                              >
                                <Trash3Fill />
                              </button>
                            </div>
                          </CouponCard>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Carousel
                    indicators={false}
                    slide={false}
                    interval={null}
                    activeIndex={currentIndex}
                    onSelect={handleSelect}
                  >
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
                            style={{
                              backgroundColor: "var(--bs-dark-bg-subtle)",
                            }}
                          >
                            <div className="d-flex flex-row justify-content-evenly">
                              <button
                                onClick={() => handleModifyCoupon(coupon.id)}
                                style={{
                                  background: "transparent",
                                  color: "var(--bs-emphasis-color)",
                                }}
                              >
                                <PencilFill />
                              </button>
                              <button
                                style={{
                                  background: "transparent",
                                  color: "var(--bs-emphasis-color)",
                                }}
                                onClick={() => handleDeleteCoupon(coupon.id)}
                              >
                                <Trash3Fill />
                              </button>
                            </div>
                          </CouponCard>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
