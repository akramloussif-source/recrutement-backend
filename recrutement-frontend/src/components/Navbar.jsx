import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const nom = localStorage.getItem('nom');

    return (
        <nav style={{ padding: '10px 20px', background: '#1a1a2e', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/offres" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                🏢 Recrutement PFA
            </Link>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/offres" style={{ color: 'white' }}>Offres</Link>
                {!user && <Link to="/login" style={{ color: 'white' }}>Connexion</Link>}
                {!user && <Link to="/register" style={{ color: 'white' }}>S'inscrire</Link>}
                {user?.role === 'CANDIDAT' && (
                    <Link to="/candidat/dashboard" style={{ color: 'white' }}>Mon espace</Link>
                )}
                {user?.role === 'RECRUTEUR' && (
                    <Link to="/recruteur/dashboard" style={{ color: 'white' }}>Mon espace</Link>
                )}
                {user && (
                    <>
                        <span style={{ color: '#aaa' }}>👤 {nom}</span>
                        <button onClick={logout}
                                style={{ background: '#e74c3c', color: 'white', border: 'none',
                                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                            Déconnexion
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}