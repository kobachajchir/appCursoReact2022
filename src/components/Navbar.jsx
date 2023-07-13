import { Link, NavLink } from "react-router-dom";
import "./../styles/NavigationBar.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { GeneralCompany } from "../App";
import { CartFill, PersonCircle } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { CartContext } from "../context/CartContext";

export default function NavigationBar() {
  const { companyInfo: compInfo, productCategories: categories } =
    useContext(GeneralCompany);
  const [navbarBrand, setNavbarBrand] = useState(compInfo.companyName);
  const [isUserLogged, setUserLogged] = useState(false);
  const { quantity, totalWithDiscount } = useContext(CartContext);
  useEffect(() => setNavbarBrand(compInfo.companyName), [compInfo]);
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  return (
    <Navbar collapseOnSelect expand="lg" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to={"/"}>
          {navbarBrand}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`aboutUs/`}>
              Sobre nosotros
            </Nav.Link>
            <NavDropdown title="Categorias" id="collasible-nav-dropdown">
              {categories.map((category) => (
                <>
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
                  <NavDropdown.Item as={Link} to={`/user`}>
                    Iniciar sesion
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to={`/user`}>
                    Mi perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/user/settings`}>
                    Configuracion
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to={`/user/logout`}>
                    Cerrar sesion
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item>theme changer</NavDropdown.Item>
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
