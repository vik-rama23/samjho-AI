"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect to QA
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login",{ email, password });
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Samadhan AI</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.primaryBtn} onClick={handleLogin}>
          Login
        </button>

        <div style={styles.divider}>— or —</div>

        <p style={styles.text}>
          Don’t have an account?
        </p>

        <button
          style={styles.secondaryBtn}
          onClick={() => router.push("/signup")}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

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
    padding: "32px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "24px",
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
  },
  secondaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #4f46e5",
    background: "#fff",
    color: "#4f46e5",
    fontSize: "15px",
    cursor: "pointer",
  },
  divider: {
    margin: "16px 0",
    color: "#999",
  },
  text: {
    fontSize: "14px",
    marginBottom: "8px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
};
