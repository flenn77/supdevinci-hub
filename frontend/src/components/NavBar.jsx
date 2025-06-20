import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <Navbar bg="light" expand="md" sticky="top" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">STH Hub</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/offers">Offres</Nav.Link>
            <Nav.Link as={Link} to="/reco">Recommandations</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
