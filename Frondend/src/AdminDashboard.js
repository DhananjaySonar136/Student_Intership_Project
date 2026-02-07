import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("student"));

  /* ================= PROTECT ADMIN ================= */
  useEffect(() => {
    if (!admin || admin.role !== "ADMIN") {
      navigate("/");
    }
  }, [admin, navigate]);

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    fetch("http://localhost:8080/api/admin/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error:", err));
  };

  /* ================= ACTIONS ================= */

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/");
  };

  const issueCertificate = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/issue-certificate/${id}`,
        { method: "POST" }
      );

      if (res.ok) {
        alert("✅ Certificate issued");
        loadStudents(); // 🔥 refresh table
      } else {
        alert("❌ Failed to issue certificate");
      }
    } catch (err) {
      console.error("Issue error:", err);
    }
  };

  const deleteStudent = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    fetch(`http://localhost:8080/api/admin/students/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setStudents(students.filter((s) => s.id !== id));
      })
      .catch((err) => console.error("Delete error:", err));
  };

  /* ================= FILTER + SORT ================= */

  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.branch.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.branch.localeCompare(b.branch)
        : b.branch.localeCompare(a.branch)
    );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>👨‍💼 Admin Dashboard</h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* SEARCH + SORT */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search by name, email, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <button onClick={() => setSortAsc(!sortAsc)} style={styles.sortBtn}>
            Sort by Branch {sortAsc ? "⬆️" : "⬇️"}
          </button>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyRow}>
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, index) => (
                <tr
                  key={s.id}
                  style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                >
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.branch}</td>

                  {/* CERTIFICATE STATUS */}
                  <td>
                    {s.certificate_no ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Issued
                      </span>
                    ) : (
                      <span style={{ color: "orange" }}>Not Issued</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button
                      style={
                        s.certificate_no
                          ? styles.disabledBtn
                          : styles.issueBtn
                      }
                      disabled={!!s.certificate_no}
                      onClick={() => issueCertificate(s.id)}
                    >
                      Issue
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteStudent(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #11998e, #38ef7d)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "950px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logoutBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    marginBottom: "10px"
  },

  search: {
    width: "60%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  sortBtn: {
    padding: "8px 12px",
    background: "#11998e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },

  tableHeader: {
    backgroundColor: "#11998e",
    color: "#fff"
  },

  evenRow: { backgroundColor: "#f9f9f9" },
  oddRow: { backgroundColor: "#ffffff" },

  emptyRow: {
    textAlign: "center",
    padding: "15px",
    color: "#777"
  },

  issueBtn: {
    marginRight: "8px",
    padding: "5px 10px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  disabledBtn: {
    marginRight: "8px",
    padding: "5px 10px",
    background: "#aaa",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed"
  },

  deleteBtn: {
    padding: "5px 10px",
    background: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default AdminDashboard;
