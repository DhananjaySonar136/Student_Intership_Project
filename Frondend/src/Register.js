import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    branch: ""
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/students/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
      });

      const message = await response.text();
      alert(message);

      if (response.ok) {
        setStudent({
          name: "",
          email: "",
          password: "",
          branch: ""
        });
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("Server error. Try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.projectTitle}>Student Internship</h1>
        <h2 style={styles.title}>Student Registration</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={student.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={student.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={student.branch}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
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
    background: "linear-gradient(135deg, #43cea2, #185a9d)"
  },

  card: {
    width: "380px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    textAlign: "center"
  },

  title: {
    marginBottom: "16px",
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
    background: "#185a9d",
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
    color: "#185a9d",
    textDecoration: "none",
    fontWeight: "bold"
  },
  projectTitle: {
  marginBottom: "7px",
  color: "#9e32e1",
  fontSize: "35px",
  fontWeight: "bold"
  }
};

export default Register;
