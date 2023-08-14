import { Link, NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import {
  Building,
  CartFill,
  MoonFill,
  PersonBadgeFill,
  PersonCircle,
  PersonWorkspace,
} from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { CartContext } from "../context/CartContext";
import ThemeChanger from "./ThemeChanger";

export default function NavigationBar() {
  const {
    companyInfo: compInfo,
    productCategories: categories,
    isUserLogged: isUserLogged,
    userInfo: userInfo,
    isUserAdmin: isUserAdmin,
    isUserSeller: isUserSeller,
    setUserInfo: setUserInfo,
    logOut: logOut,
  } = useContext(GeneralCompany);
  const navigate = useNavigate();
  const [navbarBrand, setNavbarBrand] = useState(compInfo.companyName);
  const [expanded, setExpanded] = useState(false);
  const { quantity, totalWithDiscount, validatedCoupon, priceWithCoupon } =
    useContext(CartContext);

  useEffect(() => setNavbarBrand(compInfo.companyName), [compInfo]);

  const isLg = useMediaQuery({ query: "(max-width: 991px)" });

  const navbarStyle = {
    backgroundColor: "var(--bs-dark-bg-subtle)",
    zIndex: 2,
  };

  const brandAndLinkStyle = {
    marginRight: !isLg ? "var(--bs-navbar-brand-margin-end)" : "-50px",
  };

  const themeChangerStyle = {
    paddingLeft: !isLg ? "8px" : 0,
    paddingRight: !isLg ? "8px" : 0,
  };

  const cartItemCounterStyle = {
    order: 0,
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      style={navbarStyle}
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={"/"}
          className="order-0"
          style={brandAndLinkStyle}
        >
          {navbarBrand}
        </Navbar.Brand>
        <Nav.Link
          className={`d-flex align-items-center ${!isLg ? "order-1" : ""}`}
          style={themeChangerStyle}
        >
          <ThemeChanger />
        </Nav.Link>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
          aria-controls="responsive-navbar-nav"
          className={`${!isLg ? "order-last" : ""}`}
        />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className={`${!isLg ? "order-2" : ""}`}
        >
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to={`aboutUs/`}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setExpanded(false);
              }}
            >
              Sobre nosotros
            </Nav.Link>
            <NavDropdown title="Categorias" id="collasible-nav-dropdown">
              {categories.map((category, index) => (
                <div key={category + index}>
                  {category.subcategories ? (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Header>{category.name}</NavDropdown.Header>
                      {category.subcategories.map((subcategory, index) => (
                        <NavDropdown.Item
                          as={Link}
                          to={`category/${subcategory.code}`}
                          key={subcategory + index}
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                            setExpanded(false);
                          }}
                        >
                          {subcategory.name}
                        </NavDropdown.Item>
                      ))}
                    </>
                  ) : (
                    <NavDropdown.Item
                      as={Link}
                      to={`category/${category.id}`}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                        setExpanded(false);
                      }}
                    >
                      {category.name}
                    </NavDropdown.Item>
                  )}
                </div>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to={`category/`}
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  setExpanded(false);
                }}
              >
                Todos los productos
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as={Link}
              to={`contact/`}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setExpanded(false);
              }}
            >
              Contacto
            </Nav.Link>
          </Nav>
          <Nav>
            {(isUserAdmin || isUserSeller) && (
              <Nav.Link
                as={Link}
                to={"/adminPage"}
                className="d-flex align-items-center"
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  setExpanded(false);
                }}
              >
                {!isLg ? (
                  isUserAdmin ? (
                    <Building />
                  ) : (
                    <PersonWorkspace />
                  )
                ) : isUserAdmin ? (
                  "Administracion"
                ) : (
                  "Vendedor"
                )}
              </Nav.Link>
            )}
            <NavDropdown
              title={!isLg ? <PersonCircle /> : "Usuario"}
              id="collasible-nav-dropdown"
              className="d-flex align-items-center"
            >
              {!isUserLogged ? (
                <>
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/login", { state: { redirectTo: "/" } });
                    }}
                  >
                    Iniciar sesion
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item
                    style={{ pointerEvents: "none" }}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                      setExpanded(false);
                    }}
                  >
                    Hola <strong>{userInfo.username}</strong>!
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={Link}
                    to={`/user`}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                      setExpanded(false);
                    }}
                  >
                    Mi perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/user/favorites`}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                      setExpanded(false);
                    }}
                  >
                    Favoritos
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/user/myOrders`}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                      setExpanded(false);
                    }}
                  >
                    Mis compras
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/user/settings`}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                      setExpanded(false);
                    }}
                  >
                    Configuracion
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} onClick={logOut}>
                    Cerrar sesion
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            <Nav.Link
              as={Link}
              to={"/cart"}
              className="d-flex align-items-center"
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setExpanded(false);
              }}
            >
              {!isLg ? <CartFill className="order-1" /> : "Carrito"}
              {quantity > 0 && (
                <>
                  <span
                    className="cartItemCounter"
                    style={cartItemCounterStyle}
                  >
                    {quantity}
                    {"\u00A0"}
                  </span>
                  {validatedCoupon ? (
                    <span className="cartItemCounter order-2">
                      {"\u00A0"}${totalWithDiscount - priceWithCoupon}
                    </span>
                  ) : (
                    <span className="cartItemCounter order-2">
                      {"\u00A0"}${totalWithDiscount}
                    </span>
                  )}
                </>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
