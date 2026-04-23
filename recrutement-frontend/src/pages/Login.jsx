import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // On vide l'erreur au début
        setLoading(true);
        try {
            await login(form);
            // La redirection est généralement gérée dans le contexte AuthContext
        } catch (err) {
            setError(err.response?.data?.error || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="form-container" style={{ maxWidth: '420px' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0, fontWeight: '700', fontSize: '24px' }}>Connexion</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                        Heureux de vous revoir ! Accédez à votre espace.
                    </p>
                </header>

                {error && (
                    <div className="badge badge-danger" style={{ display: "block", marginBottom: "1.5rem", padding: "0.75rem", textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Login</label>
                        <input
                            className="input"
                            placeholder="Votre nom d'utilisateur"
                            value={form.login}
                            onChange={e => setForm({...form, login: e.target.value})}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Mot de passe</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600' }}
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color: '#1a1a2e', fontWeight: '700', textDecoration: 'none' }}>
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}