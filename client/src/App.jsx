
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import IssueReport from "./pages/IssueReport";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRequests from "./pages/MyRequests";
import BuildingMaintenance from "./pages/BuildingMaintenance";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Landing page feature cards
const features = [
  {
    icon: "🛠️",
    title: "Report an Issue",
    description: "Report maintenance problems and track their progress.",
    path: "/report-issue",
  },
  {
    icon: "📋",
    title: "My Requests",
    description: "View your reported issues and their current status.",
    path: "/my-requests",
  },
  {
    icon: "🏢",
    title: "Building Maintenance",
    description: "Keep building maintenance activities organized.",
    path: "/building-maintenance",
  },
];

// Protect pages that require login
function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("fixoraLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Landing page
function LandingPage() {
  return (
    <div className="app">
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              BUILDING MAINTENANCE MADE SIMPLE
            </p>

            <h1>
              Every issue deserves
              <span> a solution.</span>
            </h1>

            <p className="hero-description">
              Fixora helps organize building maintenance and
              issue reporting in one place. Report problems,
              manage requests, and make maintenance easier.
            </p>

            <Link
              className="primary-button"
              to="/report-issue"
            >
              Report an Issue →
            </Link>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="illustration-icon">🏢</div>

            <div className="illustration-card">
              <span className="status-dot"></span>
              Maintenance made easier
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <p className="eyebrow">WHAT FIXORA OFFERS</p>
            <h2>One place for building care</h2>
            <p>
              A foundation for reporting issues and organizing
              maintenance activities.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <Link
                to={feature.path}
                className="feature-card"
                key={feature.title}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          © 2026 Fixora. Building maintenance made simpler.
        </p>
      </footer>
    </div>
  );
}

// Handle scrolling to sections such as #features
function ScrollToSection() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const sectionId = hash.substring(1);

      const scrollTimer = setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

      return () => clearTimeout(scrollTimer);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToSection />
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages requiring login */}
        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <IssueReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/building-maintenance"
          element={
            <ProtectedRoute>
              <BuildingMaintenance />
            </ProtectedRoute>
          }
        />

        <Route
        path="/admin-dashboard"
         element={
        <ProtectedRoute>
        <AdminDashboard />
         </ProtectedRoute>
  }
/>

        {/* Unknown URLs return to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
