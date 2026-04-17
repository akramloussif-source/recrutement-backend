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
        try {
            const endpoint = role === 'CANDIDAT'
                ? '/auth/register/candidat'
                : '/auth/register/recruteur';
            await api.post(endpoint, { ...form, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur inscription');
        }
    };

    const input = (label, field, type = 'text') => (
        <div style={{ marginBottom: '12px' }}>
            <label>{label}</label>
            <input type={type} value={form[field]}
                   onChange={e => setForm({...form, [field]: e.target.value})}
                   style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
        </div>
    );

    return (
        <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px',
            border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Inscription</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['CANDIDAT', 'RECRUTEUR'].map(r => (
                    <button key={r} onClick={() => setRole(r)}
                            style={{ flex: 1, padding: '8px', cursor: 'pointer',
                                background: role === r ? '#ffffff' : '#1a1a2e',
                                color: role === r ? '#1a1a2e' : '#ffffff',
                                border: 'none', borderRadius: '4px' }}>
                        {r}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {input('Login', 'login')}
                {input('Mot de passe', 'password', 'password')}
                {input('Email', 'email', 'email')}
                {role === 'CANDIDAT' && <>
                    {input('Nom', 'nom')}
                    {input('Prénom', 'prenom')}
                    {input('Téléphone', 'telephone')}
                </>}
                {role === 'RECRUTEUR' && <>
                    {input('Nom entreprise', 'nomEntreprise')}
                    {input('Poste', 'poste')}
                </>}
                <button type="submit" style={{ width: '100%', padding: '10px', marginTop: '8px',
                    background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    S'inscrire
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px' }}>
                Déjà un compte ? <Link to="/login">Connexion</Link>
            </p>
        </div>
    );
}
