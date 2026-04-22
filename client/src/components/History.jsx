import { useEffect, useState } from "react";

function History() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/resume`);
        const result = await res.json();
        setData(result.reverse());
      } catch (err) {
        console.error(err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/resume/${id}`, {
        method: "DELETE",
      });

      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // 🔍 SEARCH FILTER
  const filtered = data.filter((item) =>
    item.email?.toLowerCase().includes(search.toLowerCase()) ||
    item.skills?.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: "10px" }}>
        📂 Resume History
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by email or skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          margin: "10px 0 20px 0",
          borderRadius: "8px",
          border: "none",
          background: "#334155",
          color: "white",
          outline: "none",
        }}
      />

      {/* LOADING */}
      {loading && <p style={{ color: "gray" }}>Loading history...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* DATA */}
      {!loading && filtered.length === 0 ? (
        <p style={{ color: "gray" }}>No results found</p>
      ) : (
        filtered.map((item) => (
          <div
            key={item._id}
            style={{
              background: "#1e293b",
              color: "#e2e8f0",
              padding: "20px",
              margin: "15px 0",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            }}
          >
            <p><b>📄 File:</b> {item.fileName}</p>
            <p><b>📧 Email:</b> {item.email || "Not found"}</p>
            <p><b>📞 Phone:</b> {item.phone || "Not found"}</p>

            {/* SKILLS */}
            <p style={{ marginTop: "10px" }}><b>🧠 Skills:</b></p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {item.skills?.length > 0 ? (
                item.skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#38bdf8",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      color: "black",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ color: "gray" }}>No skills found</span>
              )}
            </div>

            {/* ATS */}
            <p style={{ marginTop: "10px" }}>
              <b>📊 ATS Score:</b>{" "}
              <span
                style={{
                  color: item.atsScore > 50 ? "#22c55e" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {item.atsScore}%
              </span>
            </p>

            {/* 🤖 AI Suggestions */}
            {item.suggestions?.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <b>💡 Suggestions:</b>
                <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                  {item.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* DELETE */}
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                marginTop: "12px",
                padding: "6px 14px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;