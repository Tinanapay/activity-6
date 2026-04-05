import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "././Login.css"; 


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/react-auth/login.php",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        localStorage.setItem("auth", "true"); // store login state
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert("Error: " + (error.response.data.message || error.response.statusText));
      } else if (error.request) {
        alert("Error: No response from server");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleSubmit}>
    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
    <button type="submit">Login</button>
    </form>

    <p> Don't have an account yet? <Link to="/register">Register</Link> </p>
    </div>
  );
}

export default Login;


