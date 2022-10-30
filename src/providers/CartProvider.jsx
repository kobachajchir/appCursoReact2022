import { useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  function addItem(item, quantity) {
    if (isInCart(item.id)) {
      const newCart = cart.map((cartItem) => {
        if (cartItem.item.id === item.id) {
          return { item, quantity: cartItem.quantity + quantity };
        } else {
          return cartItem;
        }
      });
      setCart(newCart);
    } else {
      setCart([...cart, { item, quantity }]);
    }
  }

  function removeItem(itemId) {
    const newCart = cart.filter((cartItem) => cartItem.item.id !== itemId);
    setCart(newCart);
  }

  function changeQuantity(itemId, quantity) {
    const newCart = cart.map((cartItem) => {
      if (cartItem.item.id === itemId) {
        return { item: cartItem.item, quantity };
      } else {
        return cartItem;
      }
    });
    setCart(newCart);
  }

  function clear() {
    setCart([]);
  }

  function isInCart(itemId) {
    let result = cart.some((cartItem) => cartItem.item.id === itemId);
    console.log(result);
    console.log(itemId);
    return result;
  }

  function calculateTotal() {
    let total = 0;
    cart.forEach((cartItem) => {
      total += cartItem.item.price * cartItem.quantity;
    });
    setTotal(total);
  }

  function calculateQuantity() {
    let quantity = 0;
    cart.forEach((cartItem) => {
      quantity += cartItem.quantity;
    });
    setQuantity(quantity);
  }

  function buyCart() {
    const items = cart.map((entry) => ({
      id: entry.item.id,
      title: entry.item.title,
      price: entry.item.price,
      quantity: entry.quantity,
      code: entry.item.code,
    }));
    const id = 7;
    const orderDetails = {
      id: id,
      items: items,
    };
    clear();
    return orderDetails;
  }

  useEffect(() => {
    calculateTotal();
    calculateQuantity();
    console.log(cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clear,
        isInCart,
        changeQuantity,
        buyCart,
        total,
        quantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
