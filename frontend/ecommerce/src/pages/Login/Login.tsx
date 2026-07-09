import './Login.css'
import { Link } from 'react-router-dom'

function Login(){
    return(
        <>
    <div className="auth-container">
    <div className="auth-logo-container">
      <h2 className = 'header'>Ecommerce</h2>
    </div>

    <div className="auth-card">
      <h1 className="auth-title">Sign in</h1>
      
      <form method = "post" className="auth-form">
        <div className="input-group">
          <label>Email or mobile phone number</label>
          <input type="text" id="email" name="email" required />
        </div>

        <div className="input-group">
          <label >Password</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button type="submit" className="btn-primary js-login-button mb-25">Continue</button>
      </form>

      <div className="auth-divider">
        <span>New to Ecommerce?</span>
      </div>

      <Link to = 'register' className="btn-secondary text-center block mb-25">Create your account</Link>
    </div>

    <footer className="auth-footer">
      <div className="footer-links">
        <Link to="#">Help</Link>
      </div>
      <p className="footer-copyright">© 2023, Ecommerce, Inc. or its affiliates</p>
    </footer>
    </div>
        </>
    )
}

export default Login