import { useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { api } from '../api';

export default function Reco() {
  const [city, setCity] = useState('PAR');
  const [list, setList] = useState(null);

  const fetchReco = async () => {
    const { data } = await api.get('/reco', { params: { city, k: 5 } });
    setList(data);
  };

  return (
    <Container className="py-4">
      <Form className="d-flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); fetchReco(); }}>
        <Form.Control value={city} onChange={e => setCity(e.target.value)} placeholder="Code ville" />
        <Button type="submit">Obtenir les recommandations</Button>
      </Form>

      {list && (
        <ListGroup>
          {list.map(r => (
            <ListGroup.Item key={r.city}>
              {r.city} • score : {r.score}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
