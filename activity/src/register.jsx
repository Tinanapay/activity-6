import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!minLength) return "Password must be at least 8 characters";
    if (!hasUppercase) return "Password must contain at least 1 uppercase letter";
    if (!hasNumber) return "Password must contain at least 1 number";
    if (!hasSymbol) return "Password must contain at least 1 symbol";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // VALIDATION PASS
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/activity/register.php",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSuccess("Registration successful! You can now login.");
        
        // optional auto redirect after 2 sec
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Server error");
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Register</button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Success message */}
      {success && (
        <p style={{ color: "green" }}>
          {success} <Link to="/login">Go to Login</Link>
        </p>
      )}

      <p>
        Have an account already? <Link to="/login">click here.</Link>
      </p>
    </div>
  );
}

export default Register;