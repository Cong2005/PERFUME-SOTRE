import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../App.css";
import hauiLogo from "../assets/haui-logo.png";

const API_BASE = "http://localhost:4000";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  // xử lý khi nhấn Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      navigate("/home"); // thành công → vào Home
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickRegister = async () => {
    const username = prompt("Username mới:");
    const password = prompt("Mật khẩu (>=6):");
    if (!username || !password) return;
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Register failed");
    alert("Tạo tài khoản thành công. Mời đăng nhập!");
  };

  return (
    <div className="app-grid">
      <div className="login-column">
        <h2 className="login-title">Perfume-Store</h2>

        {/* thêm onSubmit */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row">
            <label htmlFor="username">Tên đăng nhập:</label>
            {/* thêm name để lấy giá trị */}
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập..."
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          <button type="submit">Đăng nhập</button>
          <button className="register" type="button">
            Đăng ký
          </button>
        </form>
      </div>

      <div className="logo-column">
        <img src={hauiLogo} alt="Logo HaUI" className="haui-logo" />
      </div>
    </div>
  );
}
