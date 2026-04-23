import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function Offres() {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'dashboard';

    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState({});

    useEffect(() => {
        api.get('/offres').then(res => {
            setOffres(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const postuler = async (offreId) => {
        if (!token) { navigate('/login'); return; }
        try {
            const formData = new FormData();
            formData.append('offreId', offreId);
            formData.append('lettreMotivation', 'Je suis intéressé par ce poste.');
            await api.post('/candidatures/postuler', formData);

            setMessages(prev => ({
                ...prev,
                [offreId]: { type: 'success', text: 'Candidature envoyée avec succès !' }
            }));
        } catch (err) {
            const msg = err.response?.data?.error || 'Erreur lors de la postulation';
            setMessages(prev => ({
                ...prev,
                [offreId]: { type: 'error', text: msg }
            }));
        }
    };

    if (loading) return <div className="page"><p>Chargement des offres...</p></div>;

    return (
        <>
            {fromDashboard && (
                <div style={{ position: 'fixed', top: '70px', left: '0px', zIndex: 100 }}>
                    <button onClick={() => navigate('/candidat/dashboard')} className="btn btn-secondary">← Retour</button>
                </div>
            )}

            <div className="page" style={{ paddingTop: fromDashboard ? '1rem' : '0' }}>
                <h2 style={{ marginBottom: '6px' }}>Offres d'emploi</h2>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    {offres.length} offre(s) disponible(s)
                </p>

                {offres.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', color: '#888' }}>
                        Aucune offre disponible pour le moment.
                    </div>
                )}

                {offres.map(offre => (
                    <div key={offre.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ marginBottom: '6px' }}>{offre.titre}</h3>
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>
                                    {offre.description}
                                </p>

                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#777' }}>
                                    <span>📋 <strong>Type:</strong> {offre.typeContrat}</span>
                                    <span>💰 <strong>Salaire:</strong> {offre.salairePropose} €</span>
                                    <span>🏢 <strong>Entreprise:</strong> {offre.recruteur?.nomEntreprise}</span>
                                    <span style={{ color: '#e67e22' }}>📅 Limite : {offre.dateLimite}</span>
                                </div>
                            </div>

                            {/* Badge cohérent avec le style des autres pages */}
                            <span className="badge" style={{
                                background: '#d4edda',
                                color: '#155724',
                                marginLeft: '16px',
                                whiteSpace: 'nowrap'
                            }}>
                                {offre.statut || 'OUVERTE'}
                            </span>
                        </div>

                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            {role === 'CANDIDAT' && (
                                <>
                                    <button
                                        onClick={() => postuler(offre.id)}
                                        className="btn btn-success"
                                        disabled={messages[offre.id]?.type === 'success'}
                                    >
                                        {messages[offre.id]?.type === 'success' ? 'Déjà postulé' : 'Postuler maintenant'}
                                    </button>

                                    {messages[offre.id] && (
                                        <div style={{
                                            marginTop: '12px',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: messages[offre.id].type === 'success' ? '#d4edda' : '#f8d7da',
                                            color: messages[offre.id].type === 'success' ? '#155724' : '#721c24'
                                        }}>
                                            {messages[offre.id].type === 'success' ? '✅' : '❌'} {messages[offre.id].text}
                                        </div>
                                    )}
                                </>
                            )}

                            {!token && (
                                <button onClick={() => navigate('/login')} className="btn btn-primary">
                                    Se connecter pour postuler
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}