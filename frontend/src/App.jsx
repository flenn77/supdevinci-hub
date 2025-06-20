import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar        from './components/NavBar';
import Home          from './pages/Home';
import Offers        from './pages/Offers';
import OfferDetails  from './pages/OfferDetails';
import Reco          from './pages/Reco';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/offers"    element={<Offers />} />
        <Route path="/offers/:id" element={<OfferDetails />} />
        <Route path="/reco"      element={<Reco />} />
      </Routes>
    </BrowserRouter>
  );
}
