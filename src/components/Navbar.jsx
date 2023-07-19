import { Link, NavLink } from "react-router-dom";
import "./../styles/NavigationBar.css";
import { Container, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import { CartFill, MoonFill, PersonCircle } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { CartContext } from "../context/CartContext";
import ThemeChanger from "./ThemeChanger";

export default function NavigationBar() {
  const {
    companyInfo: compInfo,
    productCategories: categories,
    isUserLogged: isUserLogged,
    userInfo: userInfo,
    setUserInfo: setUserInfo,
  } = useContext(GeneralCompany);
  const [navbarBrand, setNavbarBrand] = useState(compInfo.companyName);
  const { quantity, totalWithDiscount } = useContext(CartContext);
  useEffect(() => setNavbarBrand(compInfo.companyName), [compInfo]);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  function logOut() {
    setUserInfo({ ...userInfo, isUserLogged: false });
  }
  function logIn() {
    setUserInfo({ ...userInfo, isUserLogged: true });
  }
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        backgroundColor: "var(--bs-dark-bg-subtle)",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={"/"}
          className="order-0"
          style={{
            marginRight: !isLg ? "var(--bs-navbar-brand-margin-end)" : "-50px",
          }}
        >
          {navbarBrand}
        </Navbar.Brand>
        <Nav.Link
          className={`d-flex align-items-center ${!isLg ? "order-1" : ""}`}
          style={{
            paddingLeft: !isLg ? "8px" : 0,
            paddingRight: !isLg ? "8px" : 0,
          }}
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
                <>
                  {category.subcategories ? (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Header key={category + index}>
                        {category.name}
                      </NavDropdown.Header>
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
                </>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to={`category/`}>
                Todos los productos
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
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
                  <span className="cartItemCounter order-0">
                    {quantity}
                    {"\u00A0"}
                  </span>
                  <span className="cartItemCounter order-2">
                    {"\u00A0"}${totalWithDiscount}
                  </span>
                </>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
