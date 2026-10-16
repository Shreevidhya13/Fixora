
const nodemailer = require("nodemailer");

async function sendIssueNotification(issue, resident) {
  const {
    GMAIL_USER,
    GMAIL_APP_PASSWORD,
    ADMIN_EMAIL,
  } = process.env;

  const gmailUser = GMAIL_USER?.trim();
  const adminEmail = ADMIN_EMAIL?.trim();
  const appPassword = GMAIL_APP_PASSWORD?.replace(/\s/g, "");

  if (!gmailUser || !appPassword || !adminEmail) {
    throw new Error(
      "Gmail notification settings are missing from .env"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: `"Fixora Notifications" <${gmailUser}>`,
    to: adminEmail,
    subject: `New Fixora Issue: ${issue.title}`,
    text: `
Hello Admin,

A new maintenance issue has been registered in Fixora.

Issue: ${issue.title}
Description: ${issue.description}
Category: ${issue.category}
Location: ${issue.location}
Priority: ${issue.priority}
Status: ${issue.status}

Reported by: ${resident?.name || "Resident"}
Resident email: ${resident?.email || "Not available"}

Please open the Fixora Admin Dashboard to review this issue.
    `.trim(),
  };

  await transporter.sendMail(mailOptions);

  console.log("Admin notification email sent successfully.");
}

module.exports = sendIssueNotification;
