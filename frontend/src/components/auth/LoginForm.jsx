export default function LoginForm() {
  return (
    <>
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@email.com" />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <button className="btn-primary">Enter dashboard</button>
    </>
  );
}