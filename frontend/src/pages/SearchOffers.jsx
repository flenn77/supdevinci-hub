import React, { useState } from "react";
import axios from "axios";

function SearchOffers() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [limit, setLimit] = useState(10);
  const [offers, setOffers] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/offers`, {
        params: { from, to, limit },
      });
      setOffers(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche des offres", error);
    }
  };

  return (
    <div className="container mx-auto my-5 p-5">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Ville de départ"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 m-2"
        />
        <input
          type="text"
          placeholder="Ville d'arrivée"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 m-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Rechercher
        </button>
      </div>

      <div>
        {offers.length > 0 ? (
          <ul>
            {offers.map((offer) => (
              <li key={offer._id} className="p-2 border mb-2">
                <h3>{offer.provider}</h3>
                <p>{offer.price} {offer.currency}</p>
                <p>Départ: {offer.departDate}</p>
                <p>Retour: {offer.returnDate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune offre trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default SearchOffers;
