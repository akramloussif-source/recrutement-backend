import { useEffect, useState } from "react";
import api from "../../api/axios"; // Vérifie bien le chemin vers ton fichier axios
import { useNavigate } from "react-router-dom";

export default function DashboardCandidat() {
    const nom = localStorage.getItem("nom") ?? "Candidat";
    const [candidatures, setCandidatures] = useState([]);
    const [entretiens, setEntretiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get("/candidatures/mes-candidatures"),
            api.get("/entretiens/mes-entretiens")
        ])
            .then(([resCand, resEnt]) => { // Correction de l'apostrophe ici
                setCandidatures(resCand.data || []);
                setEntretiens(resEnt.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur Dashboard:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page"><p>Chargement du tableau de bord...</p></div>;

    return (
        <div className="page">
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a2e' }}>Tableau de bord</h1>
                <p style={{ color: '#666' }}>Ravi de vous revoir, {nom}.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Ligne Candidatures */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '15px', borderRadius: '12px', fontSize: '20px' }}>📁</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Mes Candidatures</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{candidatures.length} poste(s) postulés</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/candidat/candidatures', { state: { from: 'dashboard' } })}
                            className="btn btn-primary" style={{ padding: '8px 20px' }}>
                        Gérer
                    </button>
                </div>

                {/* Ligne Entretiens */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#f3e5f5', color: '#7b1fa2', padding: '15px', borderRadius: '12px', fontSize: '20px' }}>📅</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Mes Entretiens</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{entretiens.length} rendez-vous planifiés</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/candidat/entretiens', { state: { from: 'dashboard' } })}
                            className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                        Consulter
                    </button>
                </div>

                {/* Ligne Découverte */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px dashed #ccc', background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#fff3e0', color: '#f57c00', padding: '15px', borderRadius: '12px', fontSize: '20px' }}>🔍</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Nouvelles Opportunités</h3>
                            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Trouvez votre prochain défi</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/offres', { state: { from: 'dashboard' } })}
                            className="btn" style={{ padding: '8px 20px', border: '1px solid #ddd', background: '#fff' }}>
                        Explorer
                    </button>
                </div>
            </div>

            {/* Section "Dernière minute" - Correction avec Optional Chaining */}
            {entretiens.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h4 style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Prochain événement</h4>
                    <div className="card" style={{ borderLeft: '4px solid #7b1fa2', padding: '15px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
                            Vous avez un entretien pour le poste de <strong>{entretiens[0]?.candidature?.offre?.titre || "Poste"}</strong> le {new Date(entretiens[0]?.dateHeure).toLocaleDateString('fr-FR')}.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}