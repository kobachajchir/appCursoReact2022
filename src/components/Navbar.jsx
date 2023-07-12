import { Link, NavLink } from "react-router-dom";
import CartWidget from "./CartWidget";
import "./../styles/NavigationBar.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import UserWidget from "./UserWidget";

export default function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={"/"}>
          Pacha Creaciones 3D
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link}>Pricing</Nav.Link>
            <NavDropdown title="Categorias" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={"category/BatAuto"}>
                Baterias Autos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"category/BatMoto"}>
                Baterias Moto
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"category/Radios"}>
                Radios
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to={"category"}>
                Todos los productos
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <UserWidget />
            <CartWidget />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
