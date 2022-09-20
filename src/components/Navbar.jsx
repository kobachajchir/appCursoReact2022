import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Cart, CartFill, CartPlus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import CartWidget from "./CartWidget";
import "../styles/Navigationbar.css";

export default function Navigationbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to="/" className="navbar-brand">
          BRAND
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="me-auto"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Link to={"/"} className="navLink">
              Home
            </Link>
            <Link to={"/products"} className="navLink">
              Products
            </Link>
            <Link
              to={"/cart"}
              style={{ left: "90%", position: "absolute" }}
              className="navLink"
            >
              <CartWidget />
            </Link>
            <NavDropdown
              title="Dropdown"
              id="basic-nav-dropdown"
              className="navLink"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
