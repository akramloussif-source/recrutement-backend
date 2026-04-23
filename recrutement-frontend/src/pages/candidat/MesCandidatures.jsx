import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const statutConfig = {
    EN_ATTENTE: { bg: '#fff3cd', color: '#856404', label: 'En attente' },
    EN_COURS:   { bg: '#cce5ff', color: '#004085', label: 'En cours' },
    ACCEPTEE:   { bg: '#d4edda', color: '#155724', label: 'Acceptée' },
    REFUSEE:    { bg: '#f8d7da', color: '#721c24', label: 'Refusée' }
};

export default function MesCandidatures() {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'dashboard';

    useEffect(() => {
        api.get('/candidatures/mes-candidatures')
            .then(res => {
                setCandidatures(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement candidatures:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page"><p>Chargement...</p></div>;

    return (
        <>
            {/* Bouton Retour cohérent avec les autres pages */}
            {fromDashboard && (
                <div style={{ position: 'fixed', top: '70px', left: '0px', zIndex: 100 }}>
                    <button onClick={() => navigate('/candidat/dashboard')} className="btn btn-secondary">← Retour</button>
                </div>
            )}

            <div className="page" style={{ paddingTop: fromDashboard ? '1rem' : '0' }}>
                <h2 style={{ marginBottom: '6px' }}>Mes candidatures</h2>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    {candidatures.length} candidature(s) enregistrée(s)
                </p>

                {candidatures.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', color: '#888' }}>
                        Vous n'avez pas encore postulé à une offre.
                    </div>
                )}

                {candidatures.map(c => {
                    const cfg = statutConfig[c.statutActuel] || {};
                    return (
                        <div key={c.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>{c.offre?.titre}</h3>
                                    {c.offre?.recruteur?.nomEntreprise && (
                                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
                                            🏢 {c.offre.recruteur.nomEntreprise}
                                        </p>
                                    )}

                                    {/* Date formatée pour la cohérence */}
                                    <p style={{ color: '#999', fontSize: '13px', fontWeight: '500' }}>
                                        📅 Postulé le {c.datePostulation ? new Date(c.datePostulation).toLocaleDateString('fr-FR') : '—'}
                                    </p>

                                    {c.lettreMotivation && (
                                        <div style={{
                                            marginTop: '12px',
                                            padding: '10px',
                                            background: '#f9f9f9',
                                            borderLeft: '3px solid #ddd',
                                            borderRadius: '4px'
                                        }}>
                                            <p style={{
                                                fontStyle: 'italic',
                                                color: '#555',
                                                fontSize: '13px',
                                                margin: 0
                                            }}>
                                                "{c.lettreMotivation}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <span className="badge" style={{
                                    background: cfg.bg,
                                    color: cfg.color,
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold'
                                }}>
                                    {cfg.label || c.statutActuel}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}