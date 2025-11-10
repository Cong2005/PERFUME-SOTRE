import { getCart, removeFromCart, clearCart } from "../utils/cartStore";

export default function Cart() {
  const cart = getCart();

  if (cart.length === 0) return <h2>Giỏ hàng trống</h2>;

  return (
    <div>
      <h2>Giỏ hàng</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} - {item.price}₫
          <button onClick={() => removeFromCart(item.id)}>Xoá</button>
        </div>
      ))}
      <button onClick={clearCart}>Thanh toán / Xoá giỏ</button>
    </div>
  );
}
