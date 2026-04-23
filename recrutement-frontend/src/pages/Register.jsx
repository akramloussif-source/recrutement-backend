import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState('CANDIDAT');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        login: '', password: '', email: '',
        nom: '', prenom: '', telephone: '',
        nomEntreprise: '', poste: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = role === 'CANDIDAT'
                ? '/auth/register/candidat'
                : '/auth/register/recruteur';
            await api.post(endpoint, { ...form, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
        }
    };

    const inputField = (label, field, type = 'text', placeholder = '') => (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>{label}</label>
            <input
                type={type}
                className="input"
                placeholder={placeholder}
                value={form[field]}
                onChange={e => setForm({...form, [field]: e.target.value})}
                required
            />
        </div>
    );

    return (
        <div className="page">
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontWeight: 700 }}>Créer un compte</h2>

                {/* Sélecteur de rôle style "Tabs" */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '8px' }}>
                    {['CANDIDAT', 'RECRUTEUR'].map(r => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className="btn"
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                backgroundColor: role === r ? '#ffffff' : 'transparent',
                                color: role === r ? '#1a1a2e' : '#64748b',
                                boxShadow: role === r ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}>
                            {r === 'CANDIDAT' ? 'Candidat' : 'Recruteur'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: "block", marginBottom: "1rem", padding: "0.75rem", textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {inputField('Login', 'login', 'text', 'Votre nom d\'utilisateur')}
                    {inputField('Email', 'email', 'email', 'exemple@mail.com')}
                    {inputField('Mot de passe', 'password', 'password', '••••••••')}

                    <div style={{ borderTop: '1px solid #eee', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                        {role === 'CANDIDAT' ? (
                            <>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>{inputField('Nom', 'nom')}</div>
                                    <div style={{ flex: 1 }}>{inputField('Prénom', 'prenom')}</div>
                                </div>
                                {inputField('Téléphone', 'telephone', 'tel')}
                            </>
                        ) : (
                            <>
                                {inputField('Nom de l\'entreprise', 'nomEntreprise', 'text', 'Ex: Tech Corp')}
                                {inputField('Poste occupé', 'poste', 'text', 'Ex: Responsable RH')}
                            </>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                        S'inscrire en tant que {role.toLowerCase()}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b' }}>
                    Déjà un compte ? <Link to="/login" style={{ color: '#1a1a2e', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
                </p>
            </div>
        </div>
    );
}