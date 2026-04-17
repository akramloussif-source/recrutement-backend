import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Offres() {
    const [offres, setOffres] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        api.get('/offres').then(res => setOffres(res.data));
    }, []);

    const postuler = async (offreId) => {
        if (!token) { navigate('/login'); return; }
        try {
            const formData = new FormData();
            formData.append('offreId', offreId);
            formData.append('lettreMotivation', 'Je suis intéressé par ce poste.');
            await api.post('/candidatures/postuler', formData);
            alert('Candidature envoyée !');
        } catch (err) {
            alert(err.response?.data?.error || 'Erreur');
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <h2>Offres d'emploi disponibles</h2>
            {offres.length === 0 && <p>Aucune offre disponible.</p>}
            {offres.map(offre => (
                <div key={offre.id} style={{ border: '1px solid #ddd', borderRadius: '8px',
                    padding: '20px', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px' }}>{offre.titre}</h3>
                    <p style={{ color: '#555', margin: '4px 0' }}>{offre.description}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', color: '#888', fontSize: '14px' }}>
                        <span>📋 {offre.typeContrat}</span>
                        <span>💰 {offre.salairePropose} €/mois</span>
                        <span>🏢 {offre.recruteur?.nomEntreprise}</span>
                        <span>📅 Limite: {offre.dateLimite}</span>
                    </div>
                    {role === 'CANDIDAT' && (
                        <button onClick={() => postuler(offre.id)}
                                style={{ marginTop: '12px', padding: '8px 20px', background: '#27ae60',
                                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Postuler
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}