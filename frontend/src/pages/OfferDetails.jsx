import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { api } from '../api';

export default function OfferDetails() {
  const { id }   = useParams();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    api.get(`/offers/${id}`).then(r => setOffer(r.data));
  }, [id]);

  if (!offer) return <div className="text-center py-5"><Spinner /></div>;

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>{offer.provider}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {offer.from} → {offer.to}
          </Card.Subtitle>

          <h4>{offer.price} {offer.currency}</h4>
          <p>{offer.departDate} – {offer.returnDate}</p>

          <h6 className="mt-4">Offres liées</h6>
          {offer.relatedOffers.map(oid => (
            <Badge key={oid} bg="secondary" className="me-2 mb-2">
              <Link to={`/offers/${oid}`} className="text-white text-decoration-none">{oid}</Link>
            </Badge>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
}
