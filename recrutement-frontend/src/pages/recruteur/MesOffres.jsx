import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function MesOffres() {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'dashboard';

    const charger = () => {
        api.get("/offres/mes-offres")
            .then(r => setOffres(r.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { charger(); }, []);

    const cloturer = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir clôturer cette offre ?")) {
            await api.patch(`/offres/${id}/cloturer`);
            charger();
        }
    };

    if (loading) return <div className="page"><p>Chargement de vos offres...</p></div>;

    return (
        <>
            {/* Bouton Retour cohérent */}
            {fromDashboard && (
                <div style={{ position: 'fixed', top: '70px', left: '0px', zIndex: 100 }}>
                    <button onClick={() => navigate('/recruteur/dashboard')} className="btn btn-secondary">
                        ← Retour
                    </button>
                </div>
            )}

            <div className="page" style={{ maxWidth: '900px', margin: '1 auto' }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontWeight: '700' }}>Mes offres d'emploi</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                            Gérez vos publications et suivez les candidatures.
                        </p>
                    </div>
                    <Link
                        to="/recruteur/offres/nouvelle"
                        state={{ from: fromDashboard ? 'dashboard' : null }} // On transmet l'info
                        className="btn btn-primary"
                    >
                        + Nouvelle offre
                    </Link>

                </header>

                {offres.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: '50px', color: "#64748b" }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>📁</div>
                        <p>Vous n'avez pas encore publié d'offres.</p>
                        <Link to="/recruteur/offres/nouvelle" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                            Publier votre première annonce
                        </Link>
                    </div>
                ) : (
                    offres.map(o => (
                        <div className="card" key={o.id} style={{ marginBottom: "16px", padding: '20px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                {/* Section Infos */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{o.titre}</h3>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            background: o.statut === "OUVERTE" ? '#dcfce7' : '#fee2e2',
                                            color: o.statut === "OUVERTE" ? '#166534' : '#991b1b',
                                            textTransform: 'uppercase'
                                        }}>
                                            {o.statut}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', color: "#64748b", fontSize: "13px" }}>
                                        <span>📅 Expire le : <strong>{o.dateLimite ? o.dateLimite : "Non définie"}</strong></span>
                                    </div>
                                </div>

                                {/* Section Actions */}
                                <div style={{ display: "flex", gap: "10px", alignItems: 'center' }}>
                                    <Link
                                        to={`/recruteur/candidatures/${o.id}`}
                                        className="btn btn-secondary"
                                        style={{ padding: '8px 16px', fontSize: '13px', fontWeight: '600' }}
                                    >
                                        Candidatures
                                    </Link>

                                    {o.statut === "OUVERTE" && (
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => cloturer(o.id)}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                color: '#e74c3c',
                                                border: '1px solid #fee2e2',
                                                background: '#fff',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Clôturer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}