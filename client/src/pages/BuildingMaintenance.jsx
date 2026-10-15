
import "./BuildingMaintenance.css";

const maintenanceItems = [
  {
    icon: "💧",
    title: "Plumbing",
    description: "Water pipes, taps, drainage and leakage checks.",
    status: "Needs Attention",
  },
  {
    icon: "💡",
    title: "Electrical Systems",
    description: "Lights, wiring and common-area electrical checks.",
    status: "Scheduled",
  },
  {
    icon: "🛗",
    title: "Lift Maintenance",
    description: "Routine lift inspections and safety checks.",
    status: "Scheduled",
  },
  {
    icon: "🧹",
    title: "Cleaning",
    description: "Keep corridors and shared spaces clean.",
    status: "Up to Date",
  },
  {
    icon: "🧱",
    title: "Building Structure",
    description: "Inspect walls, ceilings and visible damage.",
    status: "Up to Date",
  },
  {
    icon: "🛡️",
    title: "Safety and Security",
    description: "Check common-area safety equipment and access points.",
    status: "Scheduled",
  },
];

function BuildingMaintenance() {
  return (
    <main className="maintenance-page">
      <section className="maintenance-container">
        <div className="maintenance-heading">
          <p className="maintenance-eyebrow">
            FIXORA / BUILDING CARE
          </p>
          <h1>Building Maintenance</h1>
          <p>
            Keep your building safe, clean and well-maintained
            with an organized overview of maintenance activities.
          </p>
        </div>

        <section className="maintenance-summary">
          <article className="maintenance-summary-card">
            <span>Total Categories</span>
            <h2>{maintenanceItems.length}</h2>
          </article>

          <article className="maintenance-summary-card">
            <span>Needs Attention</span>
            <h2>
              {
                maintenanceItems.filter(
                  (item) => item.status === "Needs Attention"
                ).length
              }
            </h2>
          </article>

          <article className="maintenance-summary-card">
            <span>Scheduled</span>
            <h2>
              {
                maintenanceItems.filter(
                  (item) => item.status === "Scheduled"
                ).length
              }
            </h2>
          </article>
        </section>

        <div className="maintenance-section-heading">
          <h2>Maintenance Categories</h2>
          <p>Overview of the main areas requiring regular care.</p>
        </div>

        <section className="maintenance-grid">
          {maintenanceItems.map((item) => (
            <article className="maintenance-card" key={item.title}>
              <div className="maintenance-card-top">
                <div className="maintenance-icon">{item.icon}</div>

                <span
                  className={`maintenance-status ${item.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {item.status}
                </span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <p className="maintenance-note">
          These are example maintenance statuses for the initial
          interface. Real schedules and updates will be connected
          to the backend later.
        </p>
      </section>
    </main>
  );
}

export default BuildingMaintenance;
