import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600">
          SupDeVinci Travel Hub
        </h1>
        <p className="mt-2 text-center text-xl text-gray-500">
          Explorez des offres de voyage et obtenez des recommandations de villes
        </p>
        <div className="mt-6">
          <Link
            to="/offers"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Trouver des offres
          </Link>
        </div>
      </div>
    </div>
  );
}
