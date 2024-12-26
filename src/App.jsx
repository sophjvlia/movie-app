import './App.css';
import AuthPage from './pages/AuthPage';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Bookings from './pages/Bookings';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "./AuthContext";
import { Container, Navbar, Nav } from "react-bootstrap";
import useLocalStorage from "use-local-storage";

function Layout() {
  const { token, setToken } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      <Navbar style={{ background: "rgb(230, 230, 250)" }} variant="light">
        <Container>
          <Navbar.Brand href="/" className="d-flex justify-content-center align-items-center">
            <i className="bi bi-film me-2"></i>
            <Navbar.Text>Movies App</Navbar.Text>
          </Navbar.Brand>
          <Nav>
            <Navbar.Text>Welcome!</Navbar.Text>
            {token ? (
              <>
                <Nav.Link href="/my-bookings">My bookings</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

function PublicRoute({ element: Component }) {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/movies" replace /> : Component;
}

function PrivateRoute({ element: Component }) {
  const { token } = useContext(AuthContext);
  return token ? Component : <Navigate to="/auth" replace />;
}

export default function App() {
  const [token, setToken] = useLocalStorage("token", null);
  
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={token ? "/movies" : "/auth"} replace />} />
            <Route path="/auth" element={<PublicRoute element={<AuthPage />} />} />
            <Route path="/movies" element={<PrivateRoute element={<Movies />} />} />
            <Route path="/movies/:id" element={<PrivateRoute element={<MovieDetails />} />} />
            <Route path="/my-bookings" element={<PrivateRoute element={<Bookings />} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
