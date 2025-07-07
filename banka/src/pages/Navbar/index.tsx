import { Container, Nav, Navbar } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";

function NavbarPage() {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">{FormTexts.Home}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="userRegister">{FormTexts.UserRegister}</Nav.Link>
            <Nav.Link href="createAccount">{FormTexts.AccountCreate}</Nav.Link>
            <Nav.Link href="accounts">{FormTexts.Accounts}</Nav.Link>
            <Nav.Link href="transfer">{FormTexts.Transfer}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPage;
