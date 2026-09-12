import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ReportIssue from "./pages/ReportIssue";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TrackComplaint from "./pages/TrackComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="content">
          <h1 className="title">
            Smart Civic Issue Reporting System
          </h1>

          <p className="description">
            Report civic issues easily and help make your community better.
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
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>

        <p className="section-description">
          Report a civic problem and follow it from submission to resolution.
        </p>

        <div className="steps-container">

          <div className="step-card">
            <div className="step-number">1</div>

            <h3>Report an Issue</h3>

            <p>
              Submit a civic complaint with a description, category,
              photo, and location.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>

            <h3>Admin Verifies</h3>

            <p>
              The admin checks the complaint and accepts valid
              complaints for further action.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>

            <h3>Department Resolves</h3>

            <p>
              The responsible department works on the issue and
              updates the progress.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>

            <h3>Track Progress</h3>

            <p>
              Citizens can track the complaint status until the
              issue is resolved.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRole="user">
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/report"
        element={
          <ProtectedRoute allowedRole="user">
            <ReportIssue />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute allowedRole="user">
            <TrackComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/department"
        element={
          <ProtectedRoute allowedRole="department">
            <DepartmentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;