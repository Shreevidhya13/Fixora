import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: "🛠️",
    title: "Report an Issue",
    description:
      "Submit building maintenance problems with useful details.",
    path: "/report-issue",
  },
  {
    icon: "📋",
    title: "Track Requests",
    description:
      "Keep maintenance requests organized and easy to review.",
    path: "/my-requests",
  },
  {
    icon: "🏢",
    title: "Building Care",
    description:
      "Support a cleaner, safer, and better-maintained building.",
    path: null,
  },
];

function Home() {
  return (
    <main className="home-page" id="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">
            BUILDING MAINTENANCE MADE SIMPLE
          </p>

          <h1>
            Every issue deserves
            <span> a solution.</span>
          </h1>

          <p className="home-description">
            Fixora brings building maintenance and issue reporting
            together in one organized place. Report a problem and
            help make maintenance easier.
          </p>

          <a href="#report" className="home-primary-button">
            Report an Issue →
          </a>

          <a href="#features" className="home-secondary-button">
            Explore Features
          </a>
        </div>

        <div className="home-visual" aria-hidden="true">
          <div className="home-building-icon">🏢</div>

          <div className="home-status-card">
            <span className="home-status-dot"></span>
            Maintenance starts here
          </div>
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="home-section-heading">
          <p className="home-eyebrow">OUR FEATURES</p>
          <h2>Building care, made easier</h2>
          <p>
            Simple tools to help residents and maintenance teams
            organize building issues.
          </p>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => (
  <article className="home-feature-card" key={feature.title}>
    <div className="home-feature-icon">{feature.icon}</div>
    <h3>{feature.title}</h3>
    <p>{feature.description}</p>

    {feature.path && (
      <Link to={feature.path} className="feature-link">
        Explore feature →
      </Link>
    )}
  </article>
))}
        </div>
      </section>
    </main>
  );
}

export default Home;
