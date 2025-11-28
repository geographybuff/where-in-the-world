import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './components/MapPage';
import AddLocationPage from './components/AddLocationPage';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/add" element={<AddLocationPage />} />
        </Routes>
      </div>
    </Router>
  );
}
