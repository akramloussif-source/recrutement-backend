import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const nom = localStorage.getItem('nom');
    const role = localStorage.getItem('role');

    return (
        <nav className="navbar">
            <Link to="/offres" className="navbar-brand">RecruteFlow</Link>
            <div className="navbar-links">
                <Link to="/offres" className="navbar-link">Offres</Link>
                {!user && <>
                    <Link to="/login" className="navbar-link">Connexion</Link>
                    <Link to="/register" className="navbar-link">S'inscrire</Link>
                </>}
                {role === 'CANDIDAT' && <>
                    <Link to="/candidat/dashboard" className="navbar-link">Dashboard</Link>
                    <Link to="/candidat/candidatures" className="navbar-link">Mes candidatures</Link>
                    <Link to="/candidat/entretiens" className="navbar-link">Mes entretiens</Link>
                </>}
                {role === 'RECRUTEUR' && <>
                    <Link to="/recruteur/dashboard" className="navbar-link">Dashboard</Link>
                    <Link to="/recruteur/offres" className="navbar-link">Mes offres</Link>
                    <Link to="/recruteur/entretiens" className="navbar-link">Mes Entretiens</Link>
                </>}
                {user && <>
                    <span style={{ color: '#aab', fontSize: '14px' }}>👤 {nom}</span>
                    <button onClick={logout} className="btn btn-danger" style={{ fontSize: '13px', padding: '6px 14px' }}>
                        Déconnexion
                    </button>
                </>}
            </div>
        </nav>
    );
}