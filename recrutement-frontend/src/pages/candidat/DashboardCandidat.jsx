import { Link } from 'react-router-dom';

export default function DashboardCandidat() {
    const nom = localStorage.getItem('nom');
    return (
        <div style={{ maxWidth: '700px', margin: '60px auto', textAlign: 'center' }}>
            <h2>Bienvenue, {nom} 👋</h2>
            <p style={{ color: '#555' }}>Espace candidat</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <Link to="/offres">
                    <div style={{ padding: '30px 40px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '32px' }}>🔍</div>
                        <div>Voir les offres</div>
                    </div>
                </Link>
                <Link to="/candidat/candidatures">
                    <div style={{ padding: '30px 40px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '32px' }}>📋</div>
                        <div>Mes candidatures</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}