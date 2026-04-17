import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur de connexion');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px',
            border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label>Login</label>
                    <input value={form.login} onChange={e => setForm({...form, login: e.target.value})}
                           style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label>Mot de passe</label>
                    <input type="password" value={form.password}
                           onChange={e => setForm({...form, password: e.target.value})}
                           style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}/>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px',
                    background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Se connecter
                </button>
            </form>
            <p style={{ marginTop: '16px', textAlign: 'center' }}>
                Pas de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
}