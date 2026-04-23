import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const statutConfig = {
    EN_ATTENTE: { color: '#f39c12', label: 'En attente' },
    EN_COURS:   { color: '#3498db', label: 'En cours' },
    ACCEPTEE:   { color: '#27ae60', label: 'Acceptée' },
    REFUSEE:    { color: '#e74c3c', label: 'Refusée' }
};

export default function Candidatures() {
    const { offreId } = useParams();
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/candidatures/offre/${offreId}`)
            .then(res => {
                setCandidatures(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [offreId]);

    const changerStatut = async (id, statut) => {
        try {
            await api.patch(`/candidatures/${id}/statut?statut=${statut}`);
            setCandidatures(prev => prev.map(c => c.id === id ? {...c, statutActuel: statut} : c));
        } catch (err) {
            console.error("Erreur lors du changement de statut");
        }
    };

    if (loading) return <div className="page"><p>Chargement des candidatures...</p></div>;

    return (
        <>
            {/* Bouton Retour cohérent (Position fixe à gauche) */}
            <div style={{ position: 'fixed', top: '70px', left: '0px', zIndex: 100 }}>
                <button onClick={() => navigate('/recruteur/offres')} className="btn btn-secondary">
                    ← Retour
                </button>
            </div>

            <div className="page" style={{ maxWidth: '900px', margin: '1 auto' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '6px' }}>Candidatures reçues</h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        {candidatures.length} candidat(s) pour cette offre
                    </p>
                </header>

                {candidatures.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                        Aucune candidature pour le moment.
                    </div>
                )}

                {candidatures.map(c => {
                    const cfg = statutConfig[c.statutActuel] || { color: '#999', label: c.statutActuel };
                    return (
                        <div key={c.id} className="card" style={{ marginBottom: '20px', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                                        {c.candidat?.nom} {c.candidat?.prenom}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '13px' }}>
                                        <span>📧 {c.candidat?.email}</span>
                                        <span>📞 {c.candidat?.telephone || 'Non renseigné'}</span>
                                    </div>
                                </div>
                                <span className="badge" style={{
                                    background: `${cfg.color}15`,
                                    color: cfg.color,
                                    fontWeight: 'bold',
                                    border: `1px solid ${cfg.color}33`
                                }}>
                                    {cfg.label}
                                </span>
                            </div>

                            {c.lettreMotivation && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    borderLeft: '4px solid #ddd'
                                }}>
                                    <p style={{ fontStyle: 'italic', color: '#444', margin: 0, fontSize: '13px' }}>
                                        "{c.lettreMotivation}"
                                    </p>
                                </div>
                            )}

                            <div style={{
                                marginTop: '20px',
                                paddingTop: '15px',
                                borderTop: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {Object.keys(statutConfig).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => changerStatut(c.id, s)}
                                            disabled={c.statutActuel === s}
                                            style={{
                                                padding: '5px 12px',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                borderRadius: '15px',
                                                border: '1px solid #ddd',
                                                background: c.statutActuel === s ? statutConfig[s].color : '#fff',
                                                color: c.statutActuel === s ? '#fff' : '#666',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {statutConfig[s].label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(`/recruteur/planifier/${c.id}`)}
                                    className="btn btn-primary"
                                    style={{ padding: '7px 15px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                    📅 Planifier entretien
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}