// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import html2pdf from "html2pdf.js";


// function Dashboard() {
//   const navigate = useNavigate();
//   const student = JSON.parse(localStorage.getItem("student"));

//   const [certificate, setCertificate] = useState(null);
//   const [message, setMessage] = useState("");

//   const getCertificate = async () => {
//     if (!student) {
//       setMessage("Student not logged in");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8080/api/students/certificate/${student.id}`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setCertificate(data);
//         setMessage("");
//       } else {
//         setCertificate(null);
//         setMessage("Certificate not issued yet");
//       }
//     } catch (error) {
//       console.error("Certificate error:", error);
//       setMessage("Server error");
//     }
//   };

//   // 🔴 LOGOUT FUNCTION
//   const handleLogout = () => {
//     localStorage.removeItem("student"); // clear session
//     navigate("/"); // redirect to login
//   };

// const downloadCertificate = () => {
//   const element = document.getElementById("certificate");

//   if (!element) {
//     alert("Certificate not available");
//     return;
//   }

//   const options = {
//     margin: 0.5,
//     filename: `Certificate_${student.name}.pdf`,
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
//     filename: `Certificate_${student.name.replace(" ", "_")}.pdf`

//   };

//   html2pdf().set(options).from(element).save();
// };


//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <div style={styles.topBar}>
//           <h2>🎓 Student Dashboard</h2>
//           <button onClick={handleLogout} style={styles.logoutBtn}>
//             Logout
//           </button>
//         </div>

//         {student && (
//           <p style={styles.text}>
//             Welcome, <strong>{student.name}</strong>
//           </p>
//         )}

//         <button onClick={getCertificate} style={styles.button}>
//           Get Certificate
//         </button>

//         {message && <p style={styles.message}>{message}</p>}



//         {certificate && (
//           <div>
//             {/* CERTIFICATE PREVIEW */}
//             <div id="certificate" style={styles.certificateBox}>
//               <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
//                 🎓 CERTIFICATE OF COMPLETION
//               </h2>

//               <p style={{ textAlign: "center" }}>
//                 This is to certify that
//               </p>

//               <h3 style={{ textAlign: "center", margin: "10px 0" }}>
//                 {student.name}
//               </h3>

//               <p style={{ textAlign: "center" }}>
//                 has successfully completed the course in Web Development
//               </p>

//               <h4 style={{ textAlign: "center" }}>
//                 {student.branch}
//               </h4>

//               <p style={{ marginTop: "20px" }}>
//                 <strong>Certificate No:</strong> {certificate.certificate_no}
//               </p>

//               <p>
//                 <strong>Issue Date:</strong> {certificate.issue_date}
//               </p>

//               <p style={{ marginTop: "40px", textAlign: "right" }}>
//                 Authorized Signature
//               </p>
//             </div>

//             {/* DOWNLOAD BUTTON */}
//             <button onClick={downloadCertificate} style={styles.downloadBtn}>
//               ⬇ Download Certificate (PDF)
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(135deg, #f7971e, #ffd200)"
//   },

//   card: {
//     width: "420px",
//     background: "#fff",
//     padding: "25px",
//     borderRadius: "10px",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
//   },

//   topBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },

//   logoutBtn: {
//     background: "#ff4d4f",
//     color: "#fff",
//     border: "none",
//     padding: "6px 12px",
//     borderRadius: "5px",
//     cursor: "pointer"
//   },

//   text: {
//     margin: "20px 0",
//     fontSize: "16px"
//   },

//   button: {
//     padding: "10px 20px",
//     background: "#f7971e",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "15px",
//     cursor: "pointer"
//   },

//   message: {
//     marginTop: "15px",
//     color: "red"
//   },

//   certificateBox: {
//     marginTop: "20px",
//     padding: "15px",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     background: "#fafafa"
//   },
//   downloadBtn: {
//   marginTop: "15px",
//   padding: "10px",
//   background: "#4caf50",
//   color: "#fff",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   width: "100%"
// }

// };

// export default Dashboard;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

function Dashboard() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student"));

  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");

  const getCertificate = async () => {
    if (!student) {
      setMessage("Student not logged in");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/certificate/${student.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
        setMessage("");
      } else {
        setCertificate(null);
        setMessage("Certificate not issued yet");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/");
  };

  // DOWNLOAD PDF
  const downloadCertificate = () => {
    const element = document.getElementById("certificate");

    if (!element) {
      alert("Certificate not available");
      return;
    }

    const options = {
      margin: 0.5,
      filename: `Certificate_${(student?.name || "Student")}.pdf`,

      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <h2>🎓 Student Dashboard</h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {student && (
          <p style={styles.text}>
            Welcome, <strong>{student?.name || "Student"}</strong>
          </p>
        )}

        <button onClick={getCertificate} style={styles.button}>
          Get Certificate
        </button>

        {message && <p style={styles.message}>{message}</p>}

        {certificate && (
          <>
            {/* CERTIFICATE */}
            <div id="certificate" style={styles.certificateBox}>
              <h2 style={{ textAlign: "center" }}>
                CERTIFICATE OF COMPLETION
              </h2>

              <p style={{ textAlign: "center" }}>
                This is to certify that
              </p>

              <h3 style={{ textAlign: "center" }}>
                {student.name}
              </h3>

              <p style={{ textAlign: "center" }}>
                has successfully completed the course in
              </p>

              <h4 style={{ textAlign: "center" }}>
                Web Development 
              </h4>

              <p>
                <strong>Certificate No:</strong> {certificate.certificate_no}
              </p>

              <p>
                <strong>Issue Date:</strong> {certificate.issue_date}
              </p>

              {/* SIGNATURE */}
              <div style={{ marginTop: "50px", textAlign: "right" }}>
                <img
                  src="/Signature.jpg"
                  alt="Signature"
                  style={{ width: "120px" }}
                />
                <p>Authorized Signature</p>
              </div>
            </div>

            <button onClick={downloadCertificate} style={styles.downloadBtn}>
              ⬇ Download Certificate (PDF)
            </button>
          </>
        )}
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
    background: "linear-gradient(135deg, #f7971e, #ffd200)"
  },

  card: {
    width: "450px",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logoutBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  text: {
    margin: "20px 0"
  },

  button: {
    padding: "10px 20px",
    background: "#f7971e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  message: {
    marginTop: "15px",
    color: "red"
  },

  certificateBox: {
    marginTop: "20px",
    padding: "20px",
    border: "2px solid #333",
    borderRadius: "6px",
    background: "#fafafa"
  },

  downloadBtn: {
    marginTop: "15px",
    padding: "10px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%"
  }
};

export default Dashboard;
