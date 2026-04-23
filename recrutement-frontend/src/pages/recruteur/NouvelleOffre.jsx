import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function NouvelleOffre() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titre: "",
        description: "",
        typeContrat: "CDI",
        salairePropose: "",
        dateLimite: ""
    });
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/offres/creer", {
                titre: form.titre,
                description: form.description,
                typeContrat: form.typeContrat,
                salairePropose: form.salairePropose ? Number(form.salairePropose) : null,
                dateLimite: form.dateLimite || null,
            });
            navigate("/recruteur/offres");
        } catch (err) {
            setError(err.response?.data?.message ?? "Erreur lors de la publication.");
        }
    };

    return (
        <div className="page">
            <div className="form-container">
                {/* En-tête identique à "Planifier un entretien" */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <Link to="/recruteur/offres" className="btn btn-secondary">← Retour</Link>
                    <h2 style={{ margin: 0 }}>Publier une offre</h2>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: "block", marginBottom: "1rem", padding: "0.75rem" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Titre du poste</label>
                        <input
                            type="text" className="input" required
                            placeholder="Ex: Développeur Full Stack"
                            value={form.titre}
                            onChange={e => setForm({ ...form, titre: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Description</label>
                        <textarea
                            className="input" rows={5} required
                            placeholder="Décrivez le poste, les missions..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            style={{ resize: "vertical" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Type de contrat</label>
                            <select
                                className="input"
                                value={form.typeContrat}
                                onChange={e => setForm({ ...form, typeContrat: e.target.value })}
                            >
                                <option value="CDI">CDI</option>
                                <option value="CDD">CDD</option>
                                <option value="STAGE">Stage</option>
                                <option value="FREELANCE">Freelance</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Date limite</label>
                            <input
                                type="date" className="input"
                                value={form.dateLimite}
                                onChange={e => setForm({ ...form, dateLimite: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>Salaire proposé (optionnel)</label>
                        <input
                            type="number" className="input"
                            placeholder="Ex: 1500"
                            value={form.salairePropose}
                            onChange={e => setForm({ ...form, salairePropose: e.target.value })}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                                onClick={() => navigate("/recruteur/offres")}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}