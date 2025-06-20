import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Offers() {
  const [form, setForm]   = useState({ from: 'PAR', to: 'TYO', limit: 5 });
  const [offers, setOffers] = useState(null);

  const fetchOffers = async () => {
    setOffers(null);
    const { data } = await api.get('/offers', { params: form });
    setOffers(data);
  };

  useEffect(() => { fetchOffers(); /* auto */ }, []);        // première requête

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container>
      {/* --- formulaire simple --- */}
      <Form className="row gy-2 gx-2 align-items-end mb-4">
        {['from', 'to', 'limit'].map((field, idx) => (
          <Form.Group as={Col} md="3" key={idx}>
            <Form.Label>{field.toUpperCase()}</Form.Label>
            <Form.Control
              name={field}
              value={form[field]}
              onChange={change}
              type={field === 'limit' ? 'number' : 'text'}
            />
          </Form.Group>
        ))}
        <Col md="3">
          <Button className="w-100" onClick={fetchOffers}>Rechercher</Button>
        </Col>
      </Form>

      {/* --- résultats --- */}
      {!offers ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {offers.map(o => (
            <Col key={o._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{o.provider}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {o.from} → {o.to}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>{o.price} {o.currency}</strong><br/>
                    {o.departDate} – {o.returnDate}
                  </Card.Text>
                  <Button as={Link} to={`/offers/${o._id}`} size="sm">Détails</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
