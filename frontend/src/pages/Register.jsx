function Register() {
  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Create Account</h1>

        <p className="login-description">
          Create your FixMyCity account.
        </p>

        <form>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="login-submit">
            Create Account
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>

      </div>
    </div>
  );
}

export default Register;