import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [from, setFrom] = useState('PAR');
  const [to, setTo] = useState('TYO');
  const [limit, setLimit] = useState(2);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await axios.get(`http://localhost:3000/offers?from=${from}&to=${to}&limit=${limit}`);
        setOffers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    }
    fetchOffers();
  }, [from, to, limit]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600">Offres de Voyage</h1>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <label className="text-lg font-medium">Ville de départ</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <label className="text-lg font-medium">Ville d'arrivée</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <label className="text-lg font-medium">Nombre de résultats</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="p-2 border rounded-md"
              min="1"
            />
          </div>
          <div className="mt-6 space-y-4">
            {offers.map((offer) => (
              <div key={offer._id} className="p-4 bg-white rounded-md shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">{offer.provider}</h2>
                <p>{offer.from} → {offer.to}</p>
                <p className="font-bold">{offer.price} {offer.currency}</p>
                <p>{offer.departDate}</p>
                <p>{offer.returnDate}</p>
                <Link
                  to={`/offers/${offer._id}`}
                  className="mt-2 inline-block text-indigo-600"
                >
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
