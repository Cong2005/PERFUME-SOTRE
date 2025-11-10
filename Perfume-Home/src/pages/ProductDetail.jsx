import { useParams } from "react-router-dom";
import { getItems } from "../utils/menuStore";
import { addToCart } from "../utils/cartStore";       
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const product = getItems().find(p => p.id === id);

  if (!product) return <h2>Không tìm thấy sản phẩm</h2>;

  const handleAdd = () => {
    addToCart(product);
    navigate("/cart");                               
  };

  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} className="detail-img" />

      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="price">{product.price}₫</p>
        <p className="desc">{product.description}</p>

        <button className="add-cart-btn">Thêm vào giỏ hàng</button>
      </div>
    </div>
  );
}
