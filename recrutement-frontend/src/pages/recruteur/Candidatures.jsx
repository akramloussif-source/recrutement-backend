import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const statuts = ['EN_ATTENTE', 'EN_COURS', 'ACCEPTEE', 'REFUSEE'];
const statutColor = {
    EN_ATTENTE: '#f39c12', EN_COURS: '#3498db',
    ACCEPTEE: '#27ae60', REFUSEE: '#e74c3c'
};

export default function Candidatures() {
    const { offreId } = useParams();
    const [candidatures, setCandidatures] = useState([]);

    useEffect(() => {
        api.get(`/candidatures/offre/${offreId}`).then(res => setCandidatures(res.data));
    }, [offreId]);

    const changerStatut = async (id, statut) => {
        await api.patch(`/candidatures/${id}/statut?statut=${statut}`);
        setCandidatures(prev => prev.map(c => c.id === id ? {...c, statutActuel: statut} : c));
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <h2>Candidatures reçues</h2>
            {candidatures.length === 0 && <p>Aucune candidature pour cette offre.</p>}
            {candidatures.map(c => (
                <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px',
                    padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px' }}>
                                {c.candidat?.nom} {c.candidat?.prenom}
                            </h3>
                            <p style={{ color: '#666', margin: 0 }}>📧 {c.candidat?.email}</p>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                            background: statutColor[c.statutActuel] + '22',
                            color: statutColor[c.statutActuel], fontWeight: 'bold' }}>
              {c.statutActuel}
            </span>
                    </div>
                    {c.lettreMotivation && (
                        <p style={{ fontStyle: 'italic', color: '#444', margin: '12px 0 8px' }}>
                            "{c.lettreMotivation}"
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {statuts.map(s => (
                            <button key={s} onClick={() => changerStatut(c.id, s)}
                                    disabled={c.statutActuel === s}
                                    style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
                                        background: c.statutActuel === s ? statutColor[s] : '#f0f0f0',
                                        color: c.statutActuel === s ? 'white' : '#333',
                                        border: 'none', borderRadius: '20px' }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}