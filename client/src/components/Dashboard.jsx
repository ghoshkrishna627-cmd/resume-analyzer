import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/resume")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const chartData = {
    labels: data.map((_, i) => `Resume ${i + 1}`),
    datasets: [
      {
        label: "ATS Score",
        data: data.map(item => item.atsScore),
        backgroundColor: "#38bdf8"
      }
    ]
  };

  return (
    <div style={{ marginTop: "40px", color: "white" }}>
      <h2>📊 Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default Dashboard;