import { useState } from "react";
import History from "./components/History";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    if (file.type !== "application/pdf") {
      return alert("Only PDF allowed");
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);

    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #0f172a, #020617)",
      color: "#e2e8f0",
      padding: "40px",
      fontFamily: "Segoe UI"
    }}>

      <h1 style={{
        textAlign: "center",
        fontSize: "32px",
        marginBottom: "30px"
      }}>
        📄 Resume Analyzer
      </h1>

      {/* Upload Card */}
      <div style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
      }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "white" }}
        />

        <br /><br />

        <button
          onClick={handleUpload}
          style={{
            padding: "10px 20px",
            background: "#38bdf8",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "black"
          }}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {/* Result */}
      {data && (
        <div style={{
          background: "#f8fafc",
          color: "#0f172a",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "30px",
          maxWidth: "600px",
          marginInline: "auto",
          boxShadow: "0 6px 15px rgba(0,0,0,0.3)"
        }}>
          <h2>📊 Analysis Result</h2>

          <p><b>Email:</b> {data.email}</p>
          <p><b>Phone:</b> {data.phone}</p>

          <p><b>Skills:</b></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.skills?.map((skill, i) => (
              <span key={i} style={{
                background: "#38bdf8",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                color: "black"
              }}>
                {skill}
              </span>
            ))}
          </div>

          <p style={{ marginTop: "10px" }}>
            <b>ATS Score:</b>{" "}
            <span style={{
              color: data.atsScore > 50 ? "green" : "red",
              fontWeight: "bold"
            }}>
              {data.atsScore}%
            </span>
          </p>

          {/* Suggestions */}
          {data.suggestions?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h3>💡 Suggestions</h3>
              <ul>
                {data.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <History />
    </div>
  );
}

export default App;