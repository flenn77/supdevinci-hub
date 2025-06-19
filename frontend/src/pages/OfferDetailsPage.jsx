import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function OfferDetailsPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [relatedOffers, setRelatedOffers] = useState([]);

  useEffect(() => {
    async function fetchOffer() {
      try {
        const response = await axios.get(`http://localhost:3000/offers/${id}`);
        setOffer(response.data);
        setRelatedOffers(response.data.relatedOffers);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'offre:', error);
      }
    }
    fetchOffer();
  }, [id]);

  if (!offer) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600">Détails de l'Offre</h1>
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold">{offer.provider}</h2>
          <p>{offer.from} → {offer.to}</p>
          <p className="font-bold">{offer.price} {offer.currency}</p>
          <p>{offer.departDate}</p>
          <p>{offer.returnDate}</p>
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Offres liées :</h3>
            {relatedOffers.map((relatedId) => (
              <div key={relatedId} className="p-4 bg-gray-100 rounded-md">
                <p>{relatedId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
