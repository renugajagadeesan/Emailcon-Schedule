import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS
// import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
// import { AiFillMail } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig.js";
import sign from "../Images/ex1.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
   const [smtppassword, setSmtppassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/auth/signup`, {
        email,
        username,
        password,
        smtppassword,
      });

      toast.success(response.data.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      toast.error(error.response ? error.response.data : "Error signing up");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-cover">
        <div className="signup-aside">
          <img src={sign} alt="Sample Excel Format" className="signup-image" />
          <h2 style={{ fontWeight: "550", color: "#2f327d" }}>
            Welcome To <span style={{ color: "#f48c06" }}>Emailcon...!</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              textAlign: "center",
              padding: "0px 50px",
              color: "black",
            }}
          >
            Create your personalized template to strengthen our connection and
            enhance communication and engagement like never before.
          </p>
        </div>
        <div className="signup-container">
          <h2 className="signup-header">
            Sign<span style={{ color: "#f48c06" }}>up</span>
          </h2>
          <form onSubmit={handleSubmit} className="form-content">
            <div className="label">
              <label>Email</label>
            </div>
            <div className="input-container-sign">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="label">
              <label>Username</label>
            </div>
            <div className="input-container-sign">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="label">
              <label>Password</label>
            </div>
            <div className="input-container-sign">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="label">
              <label>Hostinger Password</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                value={smtppassword}
                onChange={(e) => setSmtppassword(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            <div className="sub-btn">
              <button
                type="submit"
                className="signup-button signup-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loader-signup"></span> // Spinner
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
            <div className="sign-log">
              <button
                onClick={() => navigate("/")}
                className="signups-button signup-alt-button"
              >
                Already have an account?{" "}
                <span style={{ color: "#2f327d" }}>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </div>
  );
}

export default Signup;
