function Login() {
  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Login</h1>

        <p className="login-description">
          Login to access your FixMyCity account.
        </p>

        <form>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

       <p className="register-text">
         Don't have an account? <a href="/register">Register</a>
       </p>

      </div>
    </div>
  );
}

export default Login;