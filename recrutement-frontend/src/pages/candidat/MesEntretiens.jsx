import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const etatConfig = {
    PLANIFIE: { bg: '#cce5ff', color: '#004085', label: 'Planifié' },
    CONFIRME: { bg: '#d4edda', color: '#155724', label: 'Confirmé' },
    ANNULE:   { bg: '#f8d7da', color: '#721c24', label: 'Annulé' },
    EFFECTUE: { bg: '#e2d9f3', color: '#6f42c1', label: 'Effectué' }
};

export default function MesEntretiens() {
    const [entretiens, setEntretiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'dashboard';

    useEffect(() => {
        api.get('/entretiens/mes-entretiens')
            .then(res => {
                setEntretiens(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page"><p>Chargement...</p></div>;

    return (
        <>
            {fromDashboard && (
                <div style={{ position: 'fixed', top: '70px', left: '0px', zIndex: 100 }}>
                    <button onClick={() => navigate('/candidat/dashboard')} className="btn btn-secondary">← Retour</button>
                </div>
            )}

            <div className="page" style={{ paddingTop: fromDashboard ? '1rem' : '0' }}>
                <h2 style={{ marginBottom: '6px' }}>Mes entretiens</h2>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    {entretiens.length} entretien(s) prévu(s)
                </p>

                {entretiens.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', color: '#888' }}>
                        Aucun entretien planifié pour l'instant.
                    </div>
                )}

                {entretiens.map(e => {
                    const cfg = etatConfig[e.etatRdv] || {};
                    return (
                        <div key={e.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>
                                        {e.candidature?.offre?.titre ?? 'Offre'}
                                    </h3>
                                    <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
                                        🏢 {e.candidature?.offre?.recruteur?.nomEntreprise}
                                    </p>
                                    <p style={{ color: '#3498db', fontSize: '13px', fontWeight: '500' }}>
                                        📅 {new Date(e.dateHeure).toLocaleString('fr-FR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                    </p>
                                    <p style={{ color: '#555', fontSize: '13px', marginTop: '10px' }}>
                                        📍 <strong>Type :</strong> {e.type}
                                        {e.salle && <span> — Salle : {e.salle}</span>}
                                    </p>
                                    {e.lienVisio && (
                                        <a href={e.lienVisio} target="_blank" rel="noreferrer"
                                           style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#007bff' }}>
                                            🔗 Rejoindre la visio
                                        </a>
                                    )}
                                </div>
                                <span className="badge" style={{ background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
                                    {cfg.label || e.etatRdv}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}