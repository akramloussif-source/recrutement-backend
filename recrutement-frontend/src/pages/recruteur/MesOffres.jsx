import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function MesOffres() {
    const [offres, setOffres] = useState([]);
    const [form, setForm] = useState({ titre: '', description: '', typeContrat: 'CDI',
        salairePropose: '', dateLimite: '' });
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const fetchOffres = () => api.get('/offres/mes-offres').then(res => setOffres(res.data));

    useEffect(() => { fetchOffres(); }, []);

    const creer = async (e) => {
        e.preventDefault();
        await api.post('/offres/creer', form);
        setShowForm(false);
        fetchOffres();
    };

    const cloturer = async (id) => {
        await api.patch(`/offres/${id}/cloturer`);
        fetchOffres();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Mes offres</h2>
                <button onClick={() => setShowForm(!showForm)}
                        style={{ padding: '8px 20px', background: '#1a1a2e', color: 'white',
                            border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Nouvelle offre
                </button>
            </div>

            {showForm && (
                <form onSubmit={creer} style={{ border: '1px solid #ddd', borderRadius: '8px',
                    padding: '20px', marginBottom: '20px' }}>
                    <h3>Créer une offre</h3>
                    {[['Titre', 'titre'], ['Description', 'description'], ['Salaire', 'salairePropose', 'number']].map(([label, field, type]) => (
                        <div key={field} style={{ marginBottom: '12px' }}>
                            <label>{label}</label>
                            <input type={type || 'text'} value={form[field]}
                                   onChange={e => setForm({...form, [field]: e.target.value})}
                                   style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
                        </div>
                    ))}
                    <div style={{ marginBottom: '12px' }}>
                        <label>Type contrat</label>
                        <select value={form.typeContrat} onChange={e => setForm({...form, typeContrat: e.target.value})}
                                style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
                            {['CDI', 'CDD', 'STAGE', 'FREELANCE'].map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label>Date limite</label>
                        <input type="date" value={form.dateLimite}
                               onChange={e => setForm({...form, dateLimite: e.target.value})}
                               style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
                    </div>
                    <button type="submit" style={{ padding: '8px 24px', background: '#27ae60',
                        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Publier
                    </button>
                </form>
            )}

            {offres.map(offre => (
                <div key={offre.id} style={{ border: '1px solid #ddd', borderRadius: '8px',
                    padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>{offre.titre}</h3>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                            background: offre.statut === 'OUVERTE' ? '#d5f5e3' : '#fde8e8',
                            color: offre.statut === 'OUVERTE' ? '#27ae60' : '#e74c3c' }}>
              {offre.statut}
            </span>
                    </div>
                    <p style={{ color: '#555' }}>{offre.description}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => navigate(`/recruteur/candidatures/${offre.id}`)}
                                style={{ padding: '6px 16px', background: '#3498db', color: 'white',
                                    border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Voir candidatures
                        </button>
                        {offre.statut === 'OUVERTE' && (
                            <button onClick={() => cloturer(offre.id)}
                                    style={{ padding: '6px 16px', background: '#e74c3c', color: 'white',
                                        border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Clôturer
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}