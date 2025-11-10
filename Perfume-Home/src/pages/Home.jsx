import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/haui-logo.png";
import { getItems } from "../utils/menuStore";

// Danh mục nước hoa
const BASE_CATEGORIES = ["Tất cả", "Nước hoa nam", "Nước hoa nữ", "Unisex"];
const MORE_CATEGORIES = ["Eau de Parfum (EDP)", "Eau de Toilette (EDT)", "Parfum/Extrait", "Eau de Cologne (EDC)", "Gift Set / Mini"];

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => { setItems(getItems()); }, []);

  useEffect(() => {
    const onClick = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  navigate("/", { replace: true });
};

  const normalize = (s) => (s || "").toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const matchSearch = (it) => {
    const q = normalize(search);
    if (!q) return true;
    return [it.name, it.brand, it.description, it.category, it.concentration]
      .some(v => normalize(v).includes(q));
  };

  const matchCategory = (it) => (active === "Tất cả" ? true : it.category === active);

  const filtered = items.filter(it => matchCategory(it) && matchSearch(it));

  const selectCategory = (label) => { setActive(label); setMoreOpen(false); };

  const formatVND = (n) =>
    (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="home-logo" />
          <h1 className="site-title">PERFUME-HOME</h1>
        </div>

        {/* Tìm kiếm */}
        <div className="header-center">
          <input
            className="search-bar"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm nước hoa theo tên/brand/nốt hương/danh mục…"
          />
        </div>

        <div className="header-right">
          <button className="icon-btn" title="Giỏ hàng" onClick={() => navigate("/cart")}>🛒</button>
          <button className="icon-btn" title="Thông báo">🔔</button>
          <div className="user-account" title="Tài khoản"><span>A</span></div>
          <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </header>

      {/* NAV */}
      <nav className="home-nav" aria-label="Danh mục nước hoa">
        {BASE_CATEGORIES.map((label) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => selectCategory(label)}
          >
            {label}
          </button>
        ))}

        {/* Xem thêm */}
        <div className="dropdown" ref={moreRef}>
          <button
            className={`dropdown-toggle ${moreOpen ? "open" : ""}`}
            onClick={() => setMoreOpen(s => !s)}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
          >
            Xem thêm <span className="caret">▾</span>
          </button>

          {moreOpen && (
            <div className="dropdown-menu" role="menu">
              {MORE_CATEGORIES.map((label) => (
                <button key={label} className="dropdown-item" onClick={() => selectCategory(label)} role="menuitem">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main className="home-main">
        {filtered.length === 0 ? (
          <p className="hint">
            Không tìm thấy sản phẩm phù hợp.
            {items.length === 0 ? " Vào trang Import để thêm nước hoa." : " Hãy thử đổi danh mục hoặc từ khóa."}
          </p>
        ) : (
          <section className="menu-grid">
            {filtered.map((it) => (
              <article key={it.id} className={`menu-card ${it.available ? "" : "menu-card--off"}`}  onClick={() => navigate(`/product/${it.id}`)}  style={{ cursor: "pointer" }}>
                <div className="menu-card__thumb">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} /> : <div className="thumb-fallback">No image</div>}
                  {!it.available && <span className="badge">Hết hàng</span>}
                </div>
                <div className="menu-card__body">
                  <h4 className="menu-card__title">{it.name}</h4>
                  <p className="menu-card__desc">
                    {it.brand ? `${it.brand} • ` : ""}
                    {it.concentration ? `${it.concentration}` : ""}
                    {it.volumeMl ? ` • ${it.volumeMl}ml` : ""}
                  </p>
                </div>
                <div className="menu-card__footer">
                  <span className="price">{formatVND(it.price)}</span>
                  <span className="category">{it.category}</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
