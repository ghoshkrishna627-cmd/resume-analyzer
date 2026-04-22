import { useState } from "react";
import History from "./components/History";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleUpload = async () => {
  if (!file) {
    alert("Select a file first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  try {
    setLoading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${import.meta.env.VITE_API_URL}/resume/upload`);

    // 🔥 TRACK PROGRESS
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      setData(result);
      setLoading(false);
      setProgress(0);
    };

    xhr.onerror = () => {
      alert("Upload failed");
      setLoading(false);
    };

    xhr.send(formData);

  } catch (error) {
    console.error(error);
    alert("Upload failed");
    setLoading(false);
  }
};
{loading && (
  <div style={{ marginTop: "20px" }}>
    <div
      style={{
        background: "#334155",
        borderRadius: "10px",
        overflow: "hidden",
        height: "12px"
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          background: "#38bdf8",
          height: "100%",
          transition: "0.3s"
        }}
      ></div>
    </div>

    <p style={{ marginTop: "5px", color: "white" }}>
      Uploading: {progress}%
    </p>
  </div>
)}
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