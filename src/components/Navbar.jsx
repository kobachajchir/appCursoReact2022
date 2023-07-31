import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import {
  Building,
  CartFill,
  MoonFill,
  PersonCircle,
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
    setUserInfo: setUserInfo,
  } = useContext(GeneralCompany);

  const [navbarBrand, setNavbarBrand] = useState(compInfo.companyName);

  const { quantity, totalWithDiscount, validatedCoupon, priceWithCoupon } =
    useContext(CartContext);

  useEffect(() => setNavbarBrand(compInfo.companyName), [compInfo]);

  const isLg = useMediaQuery({ query: "(max-width: 992px)" });

  function logOut() {
    setUserInfo({ ...userInfo, isUserLogged: false });
  }

  function logIn() {
    setUserInfo({ ...userInfo, isUserLogged: true });
  }

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
    <Navbar collapseOnSelect expand="lg" fixed="top" style={navbarStyle}>
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
          aria-controls="responsive-navbar-nav"
          className={`${!isLg ? "order-last" : ""}`}
        />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className={`${!isLg ? "order-2" : ""}`}
        >
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`aboutUs/`}>
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
                        >
                          {subcategory.name}
                        </NavDropdown.Item>
                      ))}
                    </>
                  ) : (
                    <NavDropdown.Item as={Link} to={`category/${category.id}`}>
                      {category.name}
                    </NavDropdown.Item>
                  )}
                </div>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to={`category/`}>
                Todos los productos
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to={`contact/`}>
              Contacto
            </Nav.Link>
          </Nav>
          <Nav>
            {isUserAdmin && (
              <Nav.Link
                as={Link}
                to={"/adminPage"}
                className="d-flex align-items-center"
              >
                {!isLg ? <Building /> : "Administracion"}
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
                    as={Link}
                    to={`/user/login`}
                    onClick={logIn}
                  >
                    Iniciar sesion
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item style={{ pointerEvents: "none" }}>
                    Hola <strong>{userInfo.username}</strong>!
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to={`/user`}>
                    Mi perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/user/favorites`}>
                    Favoritos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/user/myOrders`}>
                    Mis compras
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/user/settings`}>
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
