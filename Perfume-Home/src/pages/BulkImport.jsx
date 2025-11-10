import { useState } from "react";
import Papa from "papaparse";
import "./BulkImport.css";
import { getItems, addMany, updateItem, removeItem, clearItems } from "../utils/menuStore";

export default function BulkImport() {
  const [preview, setPreview] = useState([]);
  const [editing, setEditing] = useState(null);

  // file CSV mẫu cho nước hoa
  const downloadTemplate = () => {
    const csv =
      "name,brand,concentration,gender,volumeMl,category,price,description,imageUrl,available\n" +
      "La Vie Est Belle,Lancome,EDP,Nữ,75,Nước hoa nữ,2450000,Hương ngọt ngào,https://...,true\n" +
      "Bleu de Chanel,Chanel,EDP,Nam,100,Nước hoa nam,3490000,Gỗ biển lịch lãm,https://...,true\n" +
      "Baccarat Rouge 540,Maison Francis Kurkdjian,Extrait,Unisex,70,Unisex,8900000,Hổ phách gỗ,https://...,false\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "perfume_template.csv"; a.click();
  };

  const handleFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data.filter(r => r.name && r.price);
        setPreview(rows);
      }
    });
  };

  const commitImport = () => {
    const withId = preview.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name?.trim(),
      brand: p.brand?.trim(),
      concentration: p.concentration?.trim(), // EDP/EDT/Extrait/EDC…
      gender: p.gender?.trim(),              // Nam/Nữ/Unisex
      volumeMl: Number(p.volumeMl) || null,
      category: p.category?.trim(),          // phải khớp nav
      price: Number(p.price) || 0,
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      available: String(p.available).toLowerCase() === "true",
    }));
    addMany(withId);
    alert(`Đã thêm ${withId.length} sản phẩm nước hoa!`);
    setPreview([]);
  };

  const resetMenu = () => {
    if (confirm("Xoá TẤT CẢ sản phẩm?")) {
      clearItems();
      alert("Đã xoá sạch kho nước hoa.");
    }
  };

  const saveEdit = () => {
    updateItem(editing.id, editing);
    setEditing(null);
  };

  return (
    <div className="bulk-import-container">
      <h2>Quản lý nước hoa (Import CSV + Sửa/Xoá)</h2>

      {/* Hàng nút thao tác */}
      <div className="import-actions">
        <button className="import-btn" onClick={downloadTemplate}>📄 Tải file mẫu</button>

        <label className="import-btn">
          📂 Chọn file CSV
          <input type="file" accept=".csv" hidden onChange={(e) => handleFile(e.target.files[0])}/>
        </label>

        <button className="import-btn" onClick={resetMenu}>🗑 Reset kho</button>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <h3>Dữ liệu sắp nhập:</h3>
          <button className="import-btn" onClick={commitImport}>✅ Thêm vào kho</button>
        </div>
      )}

      {/* Danh sách hiện có */}
      <h3>Danh sách nước hoa hiện tại</h3>
      <table className="import-table">
        <thead>
          <tr>
            <th>Tên</th><th>Brand</th><th>Conc.</th><th>Giới tính</th>
            <th>Thể tích</th><th>Danh mục</th><th>Giá</th><th>Ảnh</th><th></th>
          </tr>
        </thead>
        <tbody>
          {getItems().map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.brand || "—"}</td>
              <td>{item.concentration || "—"}</td>
              <td>{item.gender || "—"}</td>
              <td>{item.volumeMl ? `${item.volumeMl}ml` : "—"}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.imageUrl ? "✅" : "⛔"}</td>
              <td className="table-actions">
                <button className="btn-edit" onClick={() => setEditing(item)}>Sửa</button>
                <button className="btn-delete" onClick={() => removeItem(item.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal sửa */}
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Sửa nước hoa</h3>
            <input placeholder="Tên" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}/>
            <input placeholder="Brand" value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })}/>
            <input placeholder="Concentration (EDP/EDT…)" value={editing.concentration || ""} onChange={(e) => setEditing({ ...editing, concentration: e.target.value })}/>
            <input placeholder="Giới tính (Nam/Nữ/Unisex)" value={editing.gender || ""} onChange={(e) => setEditing({ ...editing, gender: e.target.value })}/>
            <input placeholder="Thể tích (ml)" type="number" value={editing.volumeMl || ""} onChange={(e) => setEditing({ ...editing, volumeMl: Number(e.target.value) })}/>
            <input placeholder="Danh mục (khớp nav)" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })}/>
            <input placeholder="Giá (VND)" type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}/>
            <textarea placeholder="Mô tả" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}/>
            <input placeholder="Ảnh (URL)" value={editing.imageUrl || ""} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}/>

            <label className="row">
              <input type="checkbox" checked={!!editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })}/>
              Còn hàng
            </label>

            <div className="modal-actions">
              <button className="btn-close" onClick={() => setEditing(null)}>Huỷ</button>
              <button className="btn-save" onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
