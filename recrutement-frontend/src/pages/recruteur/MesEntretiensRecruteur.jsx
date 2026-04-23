import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const etatConfig = {
    PLANIFIE: { color: '#3498db', label: 'Planifié' },
    CONFIRME: { color: '#27ae60', label: 'Confirmé' },
    ANNULE:   { color: '#e74c3c', label: 'Annulé' },
    EFFECTUE: { color: '#9b59b6', label: 'Effectué' }
};

export default function MesEntretiensRecruteur() {
    const [entretiens, setEntretiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'dashboard';

    useEffect(() => {
        api.get('/entretiens/recruteur')
            .then(res => {
                setEntretiens(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const changerEtat = async (id, etat) => {
        try {
            await api.patch(`/entretiens/${id}/etat?etat=${etat}`);
            setEntretiens(prev => prev.map(e => e.id === id ? {...e, etatRdv: etat} : e));
        } catch (err) {
            console.error("Erreur changement statut", err);
        }
    };

    if (loading) return <div className="page"><p>Chargement des entretiens...</p></div>;

    return (
        <>
            {/* Bouton Retour fixe */}
            {fromDashboard && (
                <div style={{ position: 'fixed', top: '70px', left: 'px', zIndex: 100 }}>
                    <button onClick={() => navigate('/recruteur/dashboard')} className="btn btn-secondary">
                        ← Retour
                    </button>
                </div>
            )}

            <div className="page" style={{ maxWidth: '850px', margin: '1 auto' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '6px', fontWeight: '700' }}>Entretiens planifiés</h2>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>{entretiens.length} rendez-vous au calendrier</p>
                </header>

                {entretiens.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        Aucun entretien planifié pour le moment.
                    </div>
                )}

                {entretiens.map(e => {
                    const cfg = etatConfig[e.etatRdv] || { color: '#95a5a6', label: e.etatRdv };
                    return (
                        <div key={e.id} className="card" style={{ marginBottom: '16px', padding: '20px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600' }}>
                                        {e.candidature?.candidat?.nom} {e.candidature?.candidat?.prenom}
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                                        {/* Affichage de la date */}
                                        <span>📅 {new Date(e.dateHeure).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</span>

                                        {/* Affichage dynamique selon les 3 types */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {e.type === 'PRESENTIEL' && (
                                                <span>📍 <strong>Présentiel</strong> {e.salle && `— Salle ${e.salle}`}</span>
                                            )}
                                            {e.type === 'VISIOCONFERENCE' && (
                                                <span>💻 <strong>Visioconférence</strong> {e.lienVisio && `— ${e.lienVisio}`}</span>
                                            )}
                                            {e.type === 'TELEPHONIQUE' && (
                                                <span>📞 <strong>Entretien téléphonique</strong></span>
                                            )}

                                            {/* Sécurité si le type est différent ou inconnu */}
                                            {!['PRESENTIEL', 'VISIOCONFERENCE', 'TELEPHONIQUE'].includes(e.type) && (
                                                <span>❓ {e.type}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Badge de statut */}
                                <span style={{
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    background: `${cfg.color}15`,
                                    color: cfg.color,
                                    border: `1px solid ${cfg.color}33`,
                                    textTransform: 'uppercase'
                                }}>
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Barre d'actions */}
                            <div style={{
                                marginTop: '18px',
                                paddingTop: '15px',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {Object.keys(etatConfig).map(statusKey => (
                                        <button
                                            key={statusKey}
                                            onClick={() => changerEtat(e.id, statusKey)}
                                            disabled={e.etatRdv === statusKey}
                                            style={{
                                                padding: '7px 14px',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                borderRadius: '20px',
                                                border: '1px solid #e2e8f0',
                                                background: e.etatRdv === statusKey ? etatConfig[statusKey].color : '#fff',
                                                color: e.etatRdv === statusKey ? '#fff' : '#64748b',
                                                fontWeight: '700',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {etatConfig[statusKey].label}
                                        </button>
                                    ))}
                                </div>

                                {e.etatRdv === 'EFFECTUE' && (
                                    <button
                                        onClick={() => navigate(`/recruteur/evaluer/${e.id}`)}
                                        className="btn btn-primary"
                                        style={{
                                            background: '#9b59b6',
                                            padding: '8px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ✏️ Évaluer le profil
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}