"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api"

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in → redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      login(res.data.token, res.data.user);
      router.push("/qa");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        "Signup failed. Try a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create your Samjho AI account</h2>
        <p style={styles.subtitle}>
          Understand documents, finance & eligibility with AI
        </p>

        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.primaryBtn}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={styles.footerText}>
          Already have an account?
        </p>

        <button
          style={styles.secondaryBtn}
          onClick={() => router.push("/login")}
        >
          Login instead
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6fb",
  },
  card: {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "22px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px",
  },
  secondaryBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #4f46e5",
    background: "#fff",
    color: "#4f46e5",
    fontSize: "14px",
    cursor: "pointer",
  },
  footerText: {
    fontSize: "14px",
    marginTop: "16px",
    marginBottom: "6px",
  },
  error: {
    color: "#d32f2f",
    fontSize: "13px",
    marginBottom: "10px",
  },
};
