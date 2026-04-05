import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("auth");

    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="home-container">
      <h1>Welcome Home 👀</h1>
      <p>You actually made it in. Proud of you… suspiciously proud.</p>

      <div className="card">
        <h2>Status</h2>
        <p>Logged in: true</p>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;