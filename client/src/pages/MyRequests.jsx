
import { useEffect, useState } from "react";
import "./MyRequests.css";

const API_URL = "http://localhost:5000/api/issues/my";

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

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      const token = localStorage.getItem("fixoraToken");

      if (!token) {
        setError("Please log in to view your maintenance requests.");
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
            data.message || "Unable to load your maintenance requests."
          );
        }

        // Supports an array response or an object containing issues.
        const issueList = Array.isArray(data)
          ? data
          : Array.isArray(data.issues)
            ? data.issues
            : Array.isArray(data.requests)
              ? data.requests
              : [];

        const formattedRequests = issueList.map((issue) => ({
          id: issue._id || issue.id,
          title: issue.title || "Untitled issue",
          category: issue.category || "Other",
          location: issue.location || "Location unavailable",
          priority: issue.priority || "Medium",
          status: issue.status || "Submitted",
          date: formatDate(issue.createdAt || issue.date),
          description: issue.description || "No description provided.",
          photo: issue.photo || null,
        }));

        setRequests(formattedRequests);
      } catch (err) {
        setError(
          err.message ||
            "Could not connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((request) => request.status === filter);

  const submittedCount = requests.filter(
    (request) => request.status === "Submitted"
  ).length;

  const inProgressCount = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const resolvedCount = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  return (
    <main className="requests-page">
      <section className="requests-container">
        <div className="requests-heading">
          <p className="requests-eyebrow">FIXORA / MY REQUESTS</p>
          <h1>My Maintenance Requests</h1>
          <p>View your reported issues and check their progress.</p>
        </div>

        <div className="request-stats">
          <div className="request-stat">
            <span>Total Requests</span>
            <h2>{requests.length}</h2>
          </div>

          <div className="request-stat">
            <span>Submitted</span>
            <h2>{submittedCount}</h2>
          </div>

          <div className="request-stat">
            <span>In Progress</span>
            <h2>{inProgressCount}</h2>
          </div>

          <div className="request-stat">
            <span>Resolved</span>
            <h2>{resolvedCount}</h2>
          </div>
        </div>

        <div className="requests-toolbar">
          <h2>Your Requests</h2>

          <select
            aria-label="Filter requests by status"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Requests</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="requests-empty">
            <h3>Loading your requests...</h3>
            <p>Please wait while we retrieve your reports.</p>
          </div>
        ) : error ? (
          <div className="requests-empty" role="alert">
            <h3>Unable to load requests</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.length === 0 ? (
              <div className="requests-empty">
                <h3>
                  {requests.length === 0
                    ? "No reports yet"
                    : "No requests found"}
                </h3>
                <p>
                  {requests.length === 0
                    ? "Your submitted maintenance issues will appear here."
                    : "There are no requests with this status."}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div className="request-card-top">
                    <div>
                      <span className="request-category">
                        {request.category}
                      </span>
                      <h3>{request.title}</h3>
                      <p className="request-location">
                        {request.location}
                      </p>
                    </div>

                    <span
                      className={`request-status ${request.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="request-card-bottom">
                    <span>
                      Priority: <strong>{request.priority}</strong>
                    </span>

                    <span>Reported: {request.date}</span>

                    <button
                      type="button"
                      className="request-details-button"
                      onClick={() => setSelectedRequest(request)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {selectedRequest && (
          <div
            className="request-modal-backdrop"
            onClick={() => setSelectedRequest(null)}
          >
            <section
              className="request-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="request-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="request-modal-close"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close details"
              >
                ×
              </button>

              <p className="requests-eyebrow">REQUEST DETAILS</p>
              <h2 id="request-modal-title">
                {selectedRequest.title}
              </h2>

              <p>
                <strong>Category:</strong> {selectedRequest.category}
              </p>
              <p>
                <strong>Location:</strong> {selectedRequest.location}
              </p>
              <p>
                <strong>Priority:</strong> {selectedRequest.priority}
              </p>
              <p>
                <strong>Status:</strong> {selectedRequest.status}
              </p>
              <p>
                <strong>Reported date:</strong> {selectedRequest.date}
              </p>
              <p>
                <strong>Description:</strong> {selectedRequest.description}
              </p>


  {selectedRequest.photo && (
  <div className="request-photo">
    <p><strong>Attached Photo:</strong></p>
    <img
      src={`http://localhost:5000${selectedRequest.photo}`}
      alt="Uploaded maintenance issue"
      style={{
        width: "100%",
        maxWidth: "350px",
        maxHeight: "300px",
        objectFit: "contain",
        borderRadius: "10px",
      }}
    />
  </div>
)}

            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyRequests;


