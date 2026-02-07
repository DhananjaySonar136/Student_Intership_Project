console.log("🔥 THIS server.js IS RUNNING");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

/* ================== MIDDLEWARE ================== */

// Allow React frontend
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); 
app.use(express.json());

/* ================== DATABASE ================== */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",      // change if needed
  database: "student_db",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

/* ================== REGISTER ================== */

app.post("/api/students/register", async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    if (!name || !email || !password || !branch) {
      return res.status(400).send("All fields are required");
    }

    db.query(
      "SELECT id FROM students WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error("Select error:", err);
          return res.status(500).send("Database error");
        }

        if (result.length > 0) {
          return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO students (name, email, password, branch) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, branch],
          (err) => {
            if (err) {
              console.error("Insert error:", err);
              return res.status(500).send("Database error");
            }

            res.send("Registered Successfully");
          }
        );
      }
    );
  } catch (error) {
    console.error("Register crash:", error);
    res.status(500).send("Server error");
  }
});

/* ================== LOGIN ================== */

app.post("/api/students/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT id, name, email, password FROM students WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.error("Login DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const student = result[0];
      const isMatch = await bcrypt.compare(password, student.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // ✅ IMPORTANT: SEND JSON
      res.json({
        id: student.id,
        name: student.name,
        email: student.email,
        role: "STUDENT"
      });
    }
  );
});


// ================= ADMIN: GET ALL STUDENTS =================
app.get("/api/admin/students", (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.branch,
      c.certificate_no
    FROM students s
    LEFT JOIN certificates c 
      ON s.id = c.student_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Admin fetch error:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});


// ================= ISSUE CERTIFICATE =================
app.post("/api/admin/issue-certificate/:studentId", (req, res) => {
  const { studentId } = req.params;

  // 🔒 Check first
  db.query(
    "SELECT id FROM certificates WHERE student_id = ?",
    [studentId],
    (err, result) => {
      if (err) {
        console.error("Certificate check error:", err);
        return res.status(500).send("Database error");
      }

      if (result.length > 0) {
        return res.status(400).send("Certificate already issued");
      }

      const certificateNo = "CERT-" + Date.now();
      const issueDate = new Date();
      const status = "ISSUED";

      db.query(
        "INSERT INTO certificates (student_id, certificate_no, issue_date, status) VALUES (?, ?, ?, ?)",
        [studentId, certificateNo, issueDate, status],
        (err) => {
          if (err) {
            console.error("Certificate issue error:", err);
            return res.status(500).send("Certificate issue failed");
          }
          res.send("Certificate issued successfully");
        }
      );
    }
  );
});


// ================= GET CERTIFICATE =================
app.get("/api/students/certificate/:studentId", (req, res) => {
  const { studentId } = req.params;

  db.query(
    "SELECT * FROM certificates WHERE student_id = ?",
    [studentId],
    (err, result) => {
      if (err) {
        console.error("Certificate fetch error:", err);
        return res.status(500).send("Error fetching certificate");
      }

      if (result.length === 0) {
        return res.status(404).send("Certificate not issued yet");
      }

      res.json(result[0]);
    }
  );
});

// ================= DELETE STUDENT =================
app.delete("/api/admin/students/:id", (req, res) => {
  const { id } = req.params;

  // 1️⃣ Delete certificate first (important)
  db.query(
    "DELETE FROM certificates WHERE student_id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Certificate delete error:", err);
        return res.status(500).send("Failed to delete certificate");
      }

      // 2️⃣ Delete student
      db.query(
        "DELETE FROM students WHERE id = ?",
        [id],
        (err, result) => {
          if (err) {
            console.error("Student delete error:", err);
            return res.status(500).send("Failed to delete student");
          }

          if (result.affectedRows === 0) {
            return res.status(404).send("Student not found");
          }

          res.send("Student deleted successfully");
        }
      );
    }
  );
});


/* ================== SERVER ================== */

app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
