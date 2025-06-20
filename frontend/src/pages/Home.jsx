import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4 fw-bold mb-3">SupDeVinci Travel Hub</h1>
      <p className="lead mb-4">
        Agrégez vols, hôtels et activités en quelques millisecondes.
      </p>
      <Button as={Link} to="/offers" variant="primary" size="lg">
        Découvrir les offres
      </Button>
    </Container>
  );
}
