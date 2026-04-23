import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function PlanifierEntretien() {
    const { candidatureId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        dateHeure: '',
        type: 'PRESENTIEL',
        salle: '',
        lienVisio: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/entretiens/planifier', {
                ...form,
                candidatureId: Number(candidatureId),
                dateHeure: form.dateHeure,
                type: form.type,
                salle: form.type !== 'VISIO' ? form.salle : null,
                lienVisio: form.type === 'VISIO' ? form.salle : null,
            });
            setSuccess('Entretien planifié avec succès !');
            setTimeout(() => navigate('/recruteur/entretiens'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la planification');
        }
    };

    return (
        <div className="page">
            <div className="form-container">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <Link to="/recruteur/offres" className="btn btn-secondary">← Retour</Link>
                    <h2 style={{ margin: 0 }}>Planifier un entretien</h2>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: "block", marginBottom: "1rem", padding: "0.75rem" }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="badge badge-success" style={{ display: "block", marginBottom: "1rem", padding: "0.75rem" }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Date et heure</label>
                        <input type="datetime-local" className="input" required
                               value={form.dateHeure}
                               onChange={e => setForm({...form, dateHeure: e.target.value})}/>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Type</label>
                        <select className="input" value={form.type}
                                onChange={e => setForm({...form, type: e.target.value})}>
                            <option value="PRESENTIEL">Présentiel</option>
                            <option value="VISIO">Visioconférence</option>
                            <option value="TELEPHONIQUE">Téléphonique</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
                            {form.type === 'VISIO' ? 'Lien visio' : 'Lieu'}
                        </label>
                        <input className="input" required
                               placeholder={form.type === 'VISIO' ? 'https://meet.google.com/...' : 'Salle, adresse...'}
                               value={form.lieu}
                               onChange={e => setForm({...form, salle: e.target.value})}/>
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                                onClick={() => navigate(-1)}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Planifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}