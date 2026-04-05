import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link to="/register">Register</Link>
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
}