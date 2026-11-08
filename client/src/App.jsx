
import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [feedback, setFeedback] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
     const response = await axios.post(
  "https://feedback-management-system-6yuh.onrender.com/api/feedback",
        {
          name: feedback.q1,
          department: feedback.q2,
          sessionTitle: feedback.q3,
          feedback: feedback.q4,
          suggestions: feedback.q5,
        }
      );

      alert(response.data.message || "Survey submitted successfully!");

      setFeedback({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
      });
    } catch (error) {
      console.error("Survey submission failed:", error);
      alert(
        error.response?.data?.message ||
        "Unable to submit survey. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="survey-card">
        <h1>Online Survey</h1>
        <p className="subtitle">
          We value your feedback!
        </p>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            name="q1"
            value={feedback.q1}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Department</label>
          <input
            name="q2"
            value={feedback.q2}
            onChange={handleChange}
            placeholder="Enter your department"
            required
          />

          <label>Session Title</label>
          <input
            name="q3"
            value={feedback.q3}
            onChange={handleChange}
            placeholder="Enter session title"
            required
          />

          <label>Feedback</label>
          <textarea
            name="q4"
            value={feedback.q4}
            onChange={handleChange}
            placeholder="Share your feedback"
            required
          />

          <label>Suggestions</label>
          <textarea
            name="q5"
            value={feedback.q5}
            onChange={handleChange}
            placeholder="Your suggestions"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
