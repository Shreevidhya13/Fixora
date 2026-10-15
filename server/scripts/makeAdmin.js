
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

async function makeAdmin() {
  try {
    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
      console.log(
        "Usage: node scripts/makeAdmin.js your-email@example.com"
      );
      process.exitCode = 1;
      return;
    }

  await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(
        "User not found. Register and log in as a resident first."
      );
      process.exitCode = 1;
      return;
    }

    user.role = "admin";
    await user.save();

    console.log(`Admin role assigned to ${user.email}`);
  } catch (error) {
    console.error("Could not assign admin role:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
