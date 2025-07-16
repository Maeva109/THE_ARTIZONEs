import { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:8000';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCart = () => {
    fetch(`${BACKEND_URL}/api/cart/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data.items || []);
        const total = (data.items || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setTotalAmount(total);
      });
  };

  // Add to cart function
  const addToCart = (productId: number, quantity = 1) => {
    fetch(`${BACKEND_URL}/api/cart/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
      .then(res => res.json())
      .then(() => fetchCart());
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 