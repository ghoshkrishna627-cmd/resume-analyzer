const API_URL = "http://localhost:5000/api";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_URL}/resume/upload`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};