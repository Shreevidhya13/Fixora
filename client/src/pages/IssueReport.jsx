
import { useState } from "react";
import "./IssueReport.css";

const initialForm = {
  title: "",
  name: "",
  email: "",
  location: "",
  category: "",
  priority: "Medium",
  description: "",
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("fixoraUser") || "null");
  } catch {
    return null;
  }
}

function IssueReport() {
  const [form, setForm] = useState(() => {
    const user = getStoredUser();

    return {
      ...initialForm,
      name: user?.name || "",
      email: user?.email || "",
    };
  });

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handlePhotoChange(event) {
    const selectedFile = event.target.files?.[0] || null;
    setMessage("");

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      event.target.value = "";
      setPhoto(null);
      setMessage("Please select a PNG, JPEG, or WebP image.");
      setMessageType("error");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setPhoto(null);
      setMessage("Please select an image no larger than 5 MB.");
      setMessageType("error");
      return;
    }

    setPhoto(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("fixoraToken");

    if (!token) {
      setMessage("Please log in before submitting a maintenance report.");
      setMessageType("error");
      return;
    }

    if (form.title.trim().length < 3) {
      setMessage("Please enter an issue title of at least 3 characters.");
      setMessageType("error");
      return;
    }

    if (
      !form.location.trim() ||
      !form.category ||
      !form.description.trim()
    ) {
      setMessage("Please complete all required issue details.");
      setMessageType("error");
      return;
    }

    if (!["Low", "Medium", "High", "Urgent"].includes(form.priority)) {
      setMessage("Please select a valid priority.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const requestData = new FormData();

      requestData.append("title", form.title.trim());
      requestData.append("description", form.description.trim());
      requestData.append("category", form.category);
      requestData.append("location", form.location.trim());
      requestData.append("priority", form.priority);

      if (photo) {
        requestData.append("photo", photo);
      }

      const response = await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your maintenance report."
        );
      }

      setMessage(
        photo
          ? "Report and photo submitted successfully!"
          : data.message || "Your maintenance report was submitted successfully."
      );

      setMessageType("success");

      setForm((previous) => ({
        ...initialForm,
        name: previous.name,
        email: previous.email,
      }));

      setPhoto(null);

      const fileInput = document.getElementById("photo");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to Fixora's backend. Please check that the server is running."
          : error.message || "Something went wrong while submitting the report."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    const user = getStoredUser();

    setForm({
      ...initialForm,
      name: user?.name || "",
      email: user?.email || "",
    });

    setPhoto(null);
    setMessage("");

    const fileInput = document.getElementById("photo");
    if (fileInput) fileInput.value = "";
  }

  return (
    <main className="issue-page" id="report">
      <section className="issue-heading">
        <p className="issue-eyebrow">FIXORA MAINTENANCE</p>
        <h1>Report an Issue</h1>
        <p>
          Tell us what needs attention so your maintenance request
          can be reviewed.
        </p>
      </section>

      <form className="issue-form" onSubmit={handleSubmit}>
        <div className="issue-form-heading">
          <h2>Issue Details</h2>
          <p>Fields marked * are required.</p>
        </div>

        <div className="issue-form-grid">
          <div className="issue-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              readOnly
              placeholder="Log in to load your name"
            />
          </div>

          <div className="issue-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              readOnly
              placeholder="Log in to load your email"
            />
          </div>

          <div className="issue-field issue-full-width">
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Water leakage in bathroom"
              value={form.title}
              onChange={handleChange}
              minLength={3}
              maxLength={120}
              required
            />
          </div>

          <div className="issue-field">
            <label htmlFor="location">Building / Room Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Block A, Room 102"
              value={form.location}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="issue-field">
            <label htmlFor="category">Issue Category *</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Structural">Structural</option>
              <option value="Elevator">Elevator</option>
              <option value="Safety">Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="issue-field">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="issue-field issue-full-width">
            <label htmlFor="description">Issue Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the problem and where it occurs..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              required
            />

            <span className="issue-character-count">
              {form.description.length}/1000 characters
            </span>
          </div>

          <div className="issue-field issue-full-width">
            <label htmlFor="photo">Attach a Photo (Optional)</label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
            />

            <span className="issue-help">
              PNG, JPEG, or WebP. Maximum size: 5 MB.
            </span>

            {photo && (
              <p className="issue-file-name">
                Selected file: {photo.name}
              </p>
            )}
          </div>
        </div>

        {message && (
          <p
            className={`issue-feedback ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <div className="issue-actions">
          <button
            className="issue-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>

          <button
            className="issue-reset"
            type="button"
            onClick={handleReset}
            disabled={loading}
          >
            Clear Form
          </button>
        </div>
      </form>
    </main>
  );
}

export default IssueReport;
