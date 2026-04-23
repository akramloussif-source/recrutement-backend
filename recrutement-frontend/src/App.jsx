import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Offres from './pages/Offres';
import DashboardCandidat from './pages/candidat/DashboardCandidat';
import MesCandidatures from './pages/candidat/MesCandidatures';
import MesEntretiens from './pages/candidat/MesEntretiens';
import DashboardRecruteur from './pages/recruteur/DashboardRecruteur';
import MesOffres from './pages/recruteur/MesOffres';
import Candidatures from './pages/recruteur/Candidatures';
import PlanifierEntretien from './pages/recruteur/PlanifierEntretien';
import MesEntretiensRecruteur from './pages/recruteur/MesEntretiensRecruteur';
import Evaluer from './pages/recruteur/Evaluer';
import NouvelleOffre from './pages/recruteur/NouvelleOffre';


function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/offres" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offres" element={<Offres />} />

            {/* Candidat */}
            <Route path="/candidat/dashboard" element={
              <PrivateRoute role="CANDIDAT"><DashboardCandidat /></PrivateRoute>
            }/>
            <Route path="/candidat/candidatures" element={
              <PrivateRoute role="CANDIDAT"><MesCandidatures /></PrivateRoute>
            }/>
            <Route path="/candidat/entretiens" element={
              <PrivateRoute role="CANDIDAT"><MesEntretiens /></PrivateRoute>
            }/>

            {/* Recruteur */}
            <Route path="/recruteur/dashboard" element={
              <PrivateRoute role="RECRUTEUR"><DashboardRecruteur /></PrivateRoute>
            }/>
            <Route path="/recruteur/offres" element={
              <PrivateRoute role="RECRUTEUR"><MesOffres /></PrivateRoute>
            }/>
            <Route path="/recruteur/candidatures/:offreId" element={
              <PrivateRoute role="RECRUTEUR"><Candidatures /></PrivateRoute>
            }/>
            <Route path="/recruteur/planifier/:candidatureId" element={
              <PrivateRoute role="RECRUTEUR"><PlanifierEntretien /></PrivateRoute>
            }/>
            <Route path="/recruteur/entretiens" element={
              <PrivateRoute role="RECRUTEUR"><MesEntretiensRecruteur /></PrivateRoute>
            }/>
            <Route path="/recruteur/evaluer/:entretienId" element={
              <PrivateRoute role="RECRUTEUR"><Evaluer /></PrivateRoute>
            }/>
            <Route path="/recruteur/offres/nouvelle" element={
              <PrivateRoute role="RECRUTEUR"><NouvelleOffre /></PrivateRoute>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}