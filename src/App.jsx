import './App.css'
import AuthPage from './pages/AuthPage';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Bookings from './pages/Bookings';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/bookings/:user_id" element={<Bookings />} />
      </Routes>
    </Router>
  );
}
