
const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const User = require("../models/User");
const sendIssueNotification = require("../utils/sendIssueNotification");
const sendStatusUpdateNotification = require("../utils/sendStatusUpdateNotification");

async function createIssue(req, res) {
  try {
    const { title, description, category, location, priority } = req.body;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      typeof location !== "string"
    ) {
      return res.status(400).json({
        message: "Please provide valid text for all required issue fields.",
      });
    }

    if (
      priority !== undefined &&
      !["Low", "Medium", "High", "Urgent"].includes(priority)
    ) {
      return res.status(400).json({
        message: "Priority must be Low, Medium, High, or Urgent.",
      });
    }

    // Save the issue first.
    const issue = await Issue.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),
      priority: priority || "Medium",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      reportedBy: req.user.userId,
    });

    // Send an email to the admin without risking the saved issue.
    try {
      const resident = await User.findById(req.user.userId)
        .select("name email");

      await sendIssueNotification(issue, resident);
    } catch (emailError) {
      console.error(
        "Issue saved, but admin email notification failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      message: "Maintenance issue submitted successfully.",
      issue,
    });
  } catch (error) {
    console.error("Create issue error:", error.message);

    return res.status(500).json({
      message: "Unable to submit the issue. Please try again.",
    });
  }
}

// Get issues submitted by the logged-in resident
async function getMyIssues(req, res) {
  try {
    const issues = await Issue.find({
      reportedBy: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get my issues error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve your issues.",
    });
  }
}

// Get all issues (admin only)
async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get all issues error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve issues.",
    });
  }
}

// Update issue status (admin only)
async function updateIssueStatus(req, res) {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid issue ID.",
      });
    }

    const allowedStatuses = [
      "Submitted",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Please provide a valid issue status.",
      });
    }

    // Find the issue and its resident
    const issue = await Issue.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found.",
      });
    }

    const previousStatus = issue.status;

    // Save the status before attempting to send an email
    issue.status = status;
    await issue.save();

    // Send email only when the status actually changes
    if (previousStatus !== status) {
      try {
        await sendStatusUpdateNotification(
          issue,
          issue.reportedBy,
          previousStatus
        );
      } catch (emailError) {
        console.error(
          "Status updated, but resident email notification failed:",
          emailError.message
        );
      }
    }

    return res.status(200).json({
      message:
        previousStatus === status
          ? "Issue status is unchanged."
          : "Issue status updated successfully. Resident notification attempted.",
      issue,
    });
  } catch (error) {
    console.error("Update issue status error:", error.message);

    return res.status(500).json({
      message: "Unable to update issue status.",
    });
  }
}

module.exports = {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
};
// // Update issue status (admin only)
// async function updateIssueStatus(req, res) {
//   try {
//     const { status } = req.body;

//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).json({
//         message: "Invalid issue ID.",
//       });
//     }

//     const allowedStatuses = [
//       "Submitted",
//       "In Progress",
//       "Resolved",
//       "Rejected",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         message: "Please provide a valid issue status.",
//       });
//     }

//     const issue = await Issue.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!issue) {
//       return res.status(404).json({
//         message: "Issue not found.",
//       });
//     }

//     return res.status(200).json({
//       message: "Issue status updated successfully.",
//       issue,
//     });
//   } catch (error) {
//     console.error("Update issue status error:", error.message);

//     return res.status(500).json({
//       message: "Unable to update issue status.",
//     });
//   }
// }


