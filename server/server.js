
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  q1: { type: String, required: true },
  q2: { type: String, required: true },
  q3: { type: String, required: true },
  q4: { type: String, required: true },
  q5: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Home route
app.get("/", (req, res) => {
  res.send("Online Survey Backend is running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is working!",
    database: mongoose.connection.readyState === 1
      ? "Connected"
      : "Not connected"
  });
});

// Submit survey
app.post("/api/feedback", async (req, res) => {
  try {
    const {
      name,
      department,
      sessionTitle,
      feedback,
      suggestions
    } = req.body;

    if (!name || !department || !sessionTitle || !feedback) {
      return res.status(400).json({
        message: "Please fill in all required fields."
      });
    }

    const newFeedback = new Feedback({
      q1: name,
      q2: department,
      q3: sessionTitle,
      q4: feedback,
      q5: suggestions || ""
    });

    const savedFeedback = await newFeedback.save();

    console.log("\n===== NEW FEEDBACK RECEIVED =====");
    console.log("Name:", savedFeedback.q1);
    console.log("Department:", savedFeedback.q2);
    console.log("Session Title:", savedFeedback.q3);
    console.log("Feedback:", savedFeedback.q4);
    console.log("Suggestions:", savedFeedback.q5);
    console.log("Submitted At:", savedFeedback.submittedAt);
    console.log("=================================\n");

    res.status(201).json({
      message: "Survey submitted successfully!",
      feedback: savedFeedback
    });

  } catch (error) {
    console.error("Submit error:", error);

    res.status(500).json({
      message: "Failed to save survey."
    });
  }
});

// Get all survey responses
app.get("/api/getfeedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({
      submittedAt: -1
    });

    console.log("Total feedback responses:", feedbacks.length);

    res.status(200).json(feedbacks);

  } catch (error) {
    console.error("Fetch error:", error);

    res.status(500).json({
      message: "Could not retrieve survey responses."
    });
  }
});

// Connect MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
}

startServer();
