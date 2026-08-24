import "./LoginForm.css"; // reuse .field / .btn-primary styles

export default function SignupForm() {
  return (
    <>
      <div className="field">
        <label>Name</label>
        <input type="text" placeholder="Your full name" />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@email.com" />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <button className="btn-primary">Create account</button>
    </>
  );
}