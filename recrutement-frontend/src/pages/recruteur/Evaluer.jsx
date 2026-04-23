import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Evaluer() {
    const { entretienId } = useParams();
    const navigate = useNavigate();
    const [dejaEvalue, setDejaEvalue] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [form, setForm] = useState({
        entretienId: entretienId,
        noteTechnique: '',
        noteSoftSkills: '',
        avisFinal: '',
        recommandation: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.get(`/evaluations/entretien/${entretienId}`)
            .then(res => { setDejaEvalue(true); setEvaluation(res.data); })
            .catch(() => setDejaEvalue(false));
    }, [entretienId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/evaluations', {
                ...form,
                noteTechnique: parseInt(form.noteTechnique),
                noteSoftSkills: parseInt(form.noteSoftSkills),
                entretienId: parseInt(entretienId)
            });
            setSuccess('Évaluation soumise avec succès !');
            setTimeout(() => navigate('/recruteur/entretiens'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la soumission');
        }
    };

    const note = (label, field) => (
        <div style={{ marginBottom: '14px' }}>
            <label>{label} <span style={{ color: '#888', fontSize: '13px' }}>(0 - 20)</span></label>
            <input type="number" min="0" max="20" required value={form[field]}
                   onChange={e => setForm({...form, [field]: e.target.value})}
                   style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
        </div>
    );

    const telechargerPDF = async (evaluationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:8081/api/documents/evaluation/${evaluationId}/pdf`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response.ok) throw new Error('Erreur téléchargement');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport_evaluation_${evaluationId}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Erreur lors du téléchargement du PDF');
        }
    };

    if (dejaEvalue && evaluation) return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px',
            border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">← Retour</button>
                <h2 style={{ margin: 0 }}>Évaluation existante</h2>
            </div>
            <p>📊 Note technique : <strong>{evaluation.noteTechnique}/20</strong></p>
            <p>🤝 Soft skills : <strong>{evaluation.noteSoftSkills}/20</strong></p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Recommandation :
                {evaluation.recommandation ? (
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ Recommandé</span>
                ) : (
                    <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>❌ Non recommandé</span>
                )}
            </p>
            <p>📝 Avis : <em>{evaluation.avisFinal}</em></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => telechargerPDF(evaluation.id)}
                        className="btn btn-primary">
                    📄 Télécharger PDF
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px',
            border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">← Retour</button>
                <h2 style={{ margin: 0 }}>Évaluer le candidat</h2>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {note('Note technique', 'noteTechnique')}
                {note('Note soft skills', 'noteSoftSkills')}
                <div style={{ marginBottom: '14px' }}>
                    <label>Avis final</label>
                    <textarea rows="4" required value={form.avisFinal}
                              onChange={e => setForm({...form, avisFinal: e.target.value})}
                              style={{ width: '100%', padding: '8px', marginTop: '4px',
                                  boxSizing: 'border-box', resize: 'vertical' }}/>
                </div>
                <div style={{ marginBottom: '14px' }}>
                    <label>Recommandation</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        {[true, false].map(val => (
                            <button key={String(val)} type="button"
                                    onClick={() => setForm({...form, recommandation: val})}
                                    style={{ flex: 1, padding: '8px', cursor: 'pointer', border: 'none',
                                        borderRadius: '4px',
                                        background: form.recommandation === val
                                            ? (val ? '#27ae60' : '#e74c3c') : '#eee',
                                        color: form.recommandation === val ? 'white' : '#333' }}>
                                {val ? '✅ Recommandé' : '❌ Non recommandé'}
                            </button>
                        ))}
                    </div>
                </div>
                <button type="submit"
                        style={{ width: '100%', padding: '10px', background: '#1a1a2e',
                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Soumettre l'évaluation
                </button>
            </form>
        </div>
    );
}