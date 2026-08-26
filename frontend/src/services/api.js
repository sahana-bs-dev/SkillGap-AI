const BASE_URL = "http://localhost:8000";

export async function signupUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Signup failed");
  }
  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }
  return response.json();
}

export async function googleAuth(credential) {
  const response = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Google login failed");
  }
  return response.json();
}


export async function analyzeResume({ resumeFile, resumeText, jdText }) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("jd_text", jdText);
  if (resumeFile) {
    formData.append("resume_file", resumeFile);
  } else {
    formData.append("resume_text", resumeText);
  }

  const response = await fetch(`${BASE_URL}/upload/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Analysis failed");
  }
  return response.json();
}