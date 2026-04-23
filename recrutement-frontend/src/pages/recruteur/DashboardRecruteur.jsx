import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function DashboardRecruteur() {
    const nom = localStorage.getItem("nom") ?? "Recruteur";
    const [stats, setStats] = useState({ offres: 0, candidatures: 0, entretiens: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get("/offres/mes-offres"),
            api.get("/entretiens/recruteur"),
            api.get("/offres/mes-offres").then(res =>
                Promise.all((res.data || []).map(o => api.get(`/candidatures/offre/${o.id}`)))
            )
        ]).then(([offres, entretiens, candidaturesParOffre]) => {
            const totalCandidatures = candidaturesParOffre.reduce(
                (acc, res) => acc + (res.data?.length || 0), 0
            );
            setStats({
                offres: offres.data?.length || 0,
                candidatures: totalCandidatures,
                entretiens: entretiens.data?.length || 0,
            });
            setLoading(false);
        }).catch((err) => {
            console.error("Erreur Dashboard Recruteur:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="page"><p>Chargement du tableau de bord...</p></div>;

    // Styles conservés pour la cohérence originale
    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        border: '1px solid #f0f0f0'
    };

    const iconBox = (color) => ({
        width: '50px',
        height: '50px',
        borderRadius: '10px',
        background: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        marginRight: '20px'
    });

    return (
        <div className="page" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '600', color: '#1e293b' }}>Tableau de bord</h1>
                <p style={{ color: '#64748b' }}>Bonjour {nom}, gérez vos recrutements en un coup d'œil.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column' }}>

                {/* Ligne Offres */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconBox('#3b82f6')}>💼</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '17px' }}>Offres publiées</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{stats.offres} annonce(s) active(s)</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/recruteur/offres', { state: { from: 'dashboard' } })}
                            className="btn btn-primary" style={{ padding: '8px 20px' }}>
                        Gérer les offres
                    </button>
                </div>

                {/* Ligne Candidatures */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconBox('#10b981')}>📩</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '17px' }}>Candidatures reçues</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{stats.candidatures} nouveaux profils</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/recruteur/offres', { state: { from: 'dashboard' } })}
                            className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                        Voir les profils
                    </button>
                </div>

                {/* Ligne Entretiens */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconBox('#8b5cf6')}>📅</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '17px' }}>Entretiens planifiés</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{stats.entretiens} rendez-vous au calendrier</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/recruteur/entretiens', { state: { from: 'dashboard' } })}
                            className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                        Calendrier
                    </button>
                </div>
            </div>
        </div>
    );
}