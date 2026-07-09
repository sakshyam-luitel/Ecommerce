import { Link } from "react-router-dom";
import "../Login/Login.css";

function Register() {
  return (
    <>
      <div className="auth-container">
        <div className="auth-logo-container">
          <h2 className="header">Ecommerce</h2>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>

          <form className="auth-form" method="post">
            <div className="input-group">
              <label>Your name</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="First and last name"
              />
            </div>

            <div className="input-group">
              <label>Mobile number or email</label>
              <input type="text" id="email" name="email" required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="At least 6 characters"
              />
              <div className="password-hint">
                Passwords must be at least 6 characters.
              </div>
            </div>

            <div className="input-group">
              <label>Re-enter password</label>
              <input
                type="password"
                id="password-confirm"
                name="passwordconfirm"
                required
              />
            </div>

            <button className="btn-primary js-login-button">Continue</button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn-secondary text-center block">
            Sign in
          </Link>
        </div>

        <footer className="auth-footer">
          <div className="footer-links">
            <Link to="#">Help</Link>
          </div>
          <p className="footer-copyright">
            © 2023, Ecommerce, Inc. or its affiliates
          </p>
        </footer>
      </div>
    </>
  );
}

export default Register;
