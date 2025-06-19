import React, { useState } from 'react';
import axios from 'axios';

export default function RecoPage() {
  const [city, setCity] = useState('PAR');
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/reco?city=${city}&k=3`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600">Recommandations de Villes</h1>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <label className="text-lg font-medium">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={getRecommendations}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Obtenir des recommandations
            </button>
          </div>
          {recommendations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Villes recommandées :</h2>
              <ul className="space-y-2">
                {recommendations.map((rec) => (
                  <li key={rec.city} className="bg-white p-4 rounded-md shadow-sm">
                    <p>{rec.city} - Score: {rec.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
