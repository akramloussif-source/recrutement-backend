import { Link } from 'react-router-dom';

export default function DashboardRecruteur() {
    const nom = localStorage.getItem('nom');
    return (
        <div style={{ maxWidth: '700px', margin: '60px auto', textAlign: 'center' }}>
            <h2>Bienvenue, {nom} 👋</h2>
            <p style={{ color: '#555' }}>Espace recruteur</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <Link to="/recruteur/offres">
                    <div style={{ padding: '30px 40px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '32px' }}>📢</div>
                        <div>Mes offres</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}