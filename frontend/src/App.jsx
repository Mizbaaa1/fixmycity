import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="content">
        <h1 className="title">
          Smart Civic Issue Reporting System
        </h1>

        <p className="description">
          Report civic issues easily and help make your community
          better.
        </p>

        <div className="button-group">
          <button className="btn report-btn">
            Report an Issue
          </button>

          <button className="btn login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;