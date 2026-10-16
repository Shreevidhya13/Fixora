const nodemailer = require("nodemailer");

async function sendStatusUpdateNotification(issue, resident, previousStatus) {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const residentEmail = resident?.email?.trim();

  if (!gmailUser || !appPassword) {
    throw new Error("Gmail settings are missing from .env");
  }

  if (!residentEmail) {
    throw new Error("Resident email address is unavailable");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: appPassword,
    },
  });

  await transporter.sendMail({
    from: `"Fixora Notifications" <${gmailUser}>`,
    to: residentEmail,
    subject: `Fixora: Your complaint status has been updated`,
    text: `
Hello ${resident.name || "Resident"},

There is an update to your maintenance complaint in Fixora.

Complaint: ${issue.title}
Category: ${issue.category}
Location: ${issue.location}

Previous Status: ${previousStatus}
New Status: ${issue.status}

${issue.status === "Resolved"
  ? "Your maintenance complaint has been marked as resolved."
  : issue.status === "Rejected"
    ? "Your maintenance complaint has been rejected. Please contact the building administrator if you need clarification."
    : "Your maintenance complaint is being processed. Please check Fixora for further updates."}

Thank you for using Fixora.

Regards,
Fixora Maintenance Team
    `.trim(),
  });

  console.log("Resident status update email sent successfully.");
}

module.exports = sendStatusUpdateNotification;