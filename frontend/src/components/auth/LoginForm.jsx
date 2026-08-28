import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleAuth } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.access_token, data.name || "");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p style={{ color: "#F0596B", fontSize: "12.5px" }}>{error}</p>}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Enter dashboard"}
      </button>

       
      <div style={{ marginTop: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0 14px" }}>
  <div style={{ flex: 1, height: "1px", background: "#ECE9F7" }}></div>
  <span style={{ fontSize: "12px", color: "#847F9E" }}>or</span>
  <div style={{ flex: 1, height: "1px", background: "#ECE9F7" }}></div>
</div>
        <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const data = await googleAuth(credentialResponse.credential);
      login(data.access_token, data.name || "");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }}
  onError={() => {
    setError("Google login failed");
  }}
/>
      </div>
    </form>
  );
}