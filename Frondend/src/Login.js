import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // 🔐 STATIC ADMIN CREDENTIALS
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "123456";

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ADMIN LOGIN (STATIC)
    if (
      loginData.email === ADMIN_EMAIL &&
      loginData.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(
        "student",
        JSON.stringify({
          email: "admin123@gmail.com",
          role: "ADMIN"
        })
      );
      navigate("/AdminDashboard");
      return;
    }

    // ✅ STUDENT LOGIN (BACKEND)
    try {
      const response = await fetch("http://localhost:8080/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      //const message = await response.text();
      const data = await response.json();


      if (response.ok) {
        // localStorage.setItem(
        //   "student",
        //   JSON.stringify({
        //     email: loginData.email,
        //     role: "STUDENT"
        //   })
        // );
        localStorage.setItem("student", JSON.stringify(data));

        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error. Try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.projectTitle}>Student Internship & Certificate Portal</h1>
        <h2 style={styles.title}>Login</h2>


        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footerText}>
          New student?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>

        <p style={styles.adminHint}>
          <strong>Admin:</strong> admin@gmail.com / 123456
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/intership.jpg')",

  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
},


  card: {
    width: "360px",
    background: "#7fa394",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center"
  },

  title: {
    marginBottom: "20px",
    color: "#333"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    padding: "10px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer"
  },

  footerText: {
    marginTop: "15px",
    fontSize: "14px"
  },

  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "bold"
  },

  adminHint: {
    marginTop: "15px",
    fontSize: "12px",
    color: "#777"
  },
  projectTitle: {
  marginBottom: "10px",
  color: "#9e32e1",
  fontSize: "30px",
  fontWeight: "bold"
},

};

export default Login;
