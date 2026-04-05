
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/react-auth/register.php",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        alert(response.data.message || "Registration successful!");
      } else {
        alert(response.data.message || "Registration failed");
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
    <div>
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
      <p> Have an account already? <Link to="/login">click here.</Link> </p>
    </div>

  );
}

export default Register;
