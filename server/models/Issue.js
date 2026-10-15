
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
     enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
      default: "Submitted",
    },
    
 
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
       photo: {
  type: String,
  default: null,
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
