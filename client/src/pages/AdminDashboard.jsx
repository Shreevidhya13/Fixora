
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/issues";

const STATUSES = ["Submitted", "In Progress", "Resolved", "Rejected"];

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState("");

  // Load real issues from MongoDB through the backend.
  async function fetchIssues() {
    const token = localStorage.getItem("fixoraToken");

    if (!token) {
      setError("Please log in to access the admin dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load issues. Please check your admin access."
        );
      }

      const issueList = Array.isArray(data)
        ? data
        : Array.isArray(data.issues)
          ? data.issues
          : Array.isArray(data.requests)
            ? data.requests
            : [];

      const formattedIssues = issueList.map((issue) => ({
        id: issue._id || issue.id,
        title: issue.title || "Untitled issue",
        category: issue.category || "Other",
        location: issue.location || "Location unavailable",
        priority: issue.priority || "Medium",
        status: issue.status || "Submitted",
        description: issue.description || "No description provided.",
        photo: issue.photo || null,
        date: formatDate(issue.createdAt),
        reportedBy:
          typeof issue.reportedBy === "object" && issue.reportedBy !== null
            ? issue.reportedBy.name ||
              issue.reportedBy.email ||
              "Resident"
            : "Resident",
      }));

      setIssues(formattedIssues);

      // Keep the open details popup synchronized with fetched data.
      setSelectedIssue((current) => {
        if (!current) return null;

        return (
          formattedIssues.find((issue) => issue.id === current.id) || null
        );
      });
    } catch (err) {
      setError(
        err.message || "Could not connect to the Fixora server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  const totalIssues = issues.length;

  const submittedIssues = issues.filter(
    (issue) => issue.status === "Submitted"
  ).length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  // Save the new status to MongoDB.
  async function updateStatus(id, newStatus) {
    if (!STATUSES.includes(newStatus)) return;

    const token = localStorage.getItem("fixoraToken");

    if (!token) {
      setError("Please log in again to update issue status.");
      return;
    }

    const previousIssue = issues.find((issue) => issue.id === id);

    if (!previousIssue || previousIssue.status === newStatus) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      setNotice("");

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update the issue status."
        );
      }

      // Update the page only after the backend confirms success.
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === id
            ? { ...issue, status: newStatus }
            : issue
        )
      );

      setSelectedIssue((currentIssue) =>
        currentIssue && currentIssue.id === id
          ? { ...currentIssue, status: newStatus }
          : currentIssue
      );

      setNotice(`Issue status updated to "${newStatus}".`);
    } catch (err) {
      setError(
        err.message || "Could not update the issue status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">FIXORA MANAGEMENT</p>
            <h1>Admin Dashboard</h1>
            <p>
              Monitor building issues and keep maintenance work organized.
            </p>
          </div>

          <div className="admin-welcome-icon">🏢</div>
        </section>

        <section className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-icon total-icon">📋</div>
            <p>Total Issues</p>
            <h2>{totalIssues}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon pending-icon">⏳</div>
            <p>Submitted</p>
            <h2>{submittedIssues}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon progress-icon">🔧</div>
            <p>In Progress</p>
            <h2>{inProgressIssues}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon resolved-icon">✅</div>
            <p>Resolved</p>
            <h2>{resolvedIssues}</h2>
          </article>
        </section>

        <section className="admin-issues-section">
          <div className="admin-issues-heading">
            <div>
              <h2>Maintenance Requests</h2>
              <p>Review reports and update their status.</p>
            </div>

            <div>
              <select
                className="admin-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter issues by status"
              >
                <option value="All">All Issues</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="admin-view-button"
                onClick={fetchIssues}
                disabled={loading}
                style={{ marginLeft: "10px" }}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {error && (
            <div className="requests-empty" role="alert">
              <p>{error}</p>
            </div>
          )}

          {notice && (
            <p role="status" style={{ margin: "12px 0" }}>
              {notice}
            </p>
          )}

          {loading ? (
            <div className="requests-empty">
              <h3>Loading maintenance requests...</h3>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-issues-table">
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id}>
                      <td>
                        <strong>{issue.title}</strong>
                        <span className="admin-issue-id">
                          {issue.id}
                        </span>
                      </td>

                      <td>{issue.category}</td>

                      <td>
                        <span
                          className={`admin-priority priority-${issue.priority.toLowerCase()}`}
                        >
                          {issue.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status status-${issue.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      <td>
                        <select
                          className="admin-status-select"
                          value={issue.status}
                          disabled={updatingId === issue.id}
                          onChange={(event) =>
                            updateStatus(issue.id, event.target.value)
                          }
                          aria-label={`Update status for ${issue.title}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId === issue.id && (
                          <small> Saving...</small>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-view-button"
                          onClick={() => setSelectedIssue(issue)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredIssues.length === 0 && (
                    <tr>
                      <td colSpan="6" className="admin-empty">
                        {error
                          ? "Issues could not be loaded."
                          : "No requests found for this status."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedIssue && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedIssue(null)}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">ISSUE DETAILS</p>
                <h2 id="admin-modal-title">{selectedIssue.title}</h2>
                <span className="admin-issue-id">
                  Request ID: {selectedIssue.id}
                </span>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedIssue(null)}
                aria-label="Close issue details"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-details">
              <div className="admin-detail-row">
                <span>Category</span>
                <strong>{selectedIssue.category}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Location</span>
                <strong>{selectedIssue.location}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Priority</span>
                <strong>{selectedIssue.priority}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Current Status</span>
                <strong>{selectedIssue.status}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Reported By</span>
                <strong>{selectedIssue.reportedBy}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Reported Date</span>
                <strong>{selectedIssue.date}</strong>
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <strong>Description</strong>
              <p>{selectedIssue.description}</p>
            </div>

            {selectedIssue.photo && (
              <div style={{ marginTop: "18px" }}>
                <strong>Attached Photo</strong>
                <img
                  src={`http://localhost:5000${selectedIssue.photo}`}
                  alt="Reported maintenance issue"
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "350px",
                    maxHeight: "300px",
                    objectFit: "contain",
                    marginTop: "12px",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <label htmlFor="admin-modal-status">
                <strong>Update Issue Status</strong>
              </label>

              <select
                id="admin-modal-status"
                className="admin-status-select"
                value={selectedIssue.status}
                disabled={updatingId === selectedIssue.id}
                onChange={(event) =>
                  updateStatus(selectedIssue.id, event.target.value)
                }
                style={{ display: "block", marginTop: "10px" }}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-close-button"
                onClick={() => setSelectedIssue(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
