import { useEffect, useState } from 'react';
import api from '../../api/axios';

const statutColor = {
    EN_ATTENTE: '#f39c12', EN_COURS: '#3498db',
    ACCEPTEE: '#27ae60', REFUSEE: '#e74c3c'
};

export default function MesCandidatures() {
    const [candidatures, setCandidatures] = useState([]);

    useEffect(() => {
        api.get('/candidatures/mes-candidatures').then(res => setCandidatures(res.data));
    }, []);

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <h2>Mes candidatures</h2>
            {candidatures.length === 0 && <p>Aucune candidature pour l'instant.</p>}
            {candidatures.map(c => (
                <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px',
                    padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>{c.offre?.titre}</h3>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                            background: statutColor[c.statutActuel] + '22',
                            color: statutColor[c.statutActuel], fontWeight: 'bold' }}>
              {c.statutActuel}
            </span>
                    </div>
                    <p style={{ color: '#555', margin: '8px 0 4px' }}>🏢 {c.offre?.recruteur?.nomEntreprise}</p>
                    <p style={{ color: '#888', fontSize: '13px' }}>📅 Postulé le {c.datePostulation}</p>
                    {c.lettreMotivation && (
                        <p style={{ color: '#444', fontStyle: 'italic', marginTop: '8px' }}>
                            "{c.lettreMotivation}"
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}