import { ICartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartState {
  cartItems: ICartItem[];
  isCartOpen: boolean;
  isLoaded: boolean;
}

const getCartItemId = (product: Product, selectedSize: number | null): string => {
  const sizeKey = selectedSize !== null && selectedSize !== undefined ? selectedSize : 'NOSIZE';
  return `${product._id}-${sizeKey}`;
};

const loadCartFromLocalStorage = (): ICartItem[] => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
};

const initialState: ICartState = {
  cartItems: loadCartFromLocalStorage(), 
  isCartOpen: false,
  isLoaded: true, 
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 🎁 Equivalent to: addToCart
    addToCart: (state, action: PayloadAction<{ product: Product, selectedSize: number | null }>) => {
      const { product, selectedSize } = action.payload;
      const itemId = getCartItemId(product, selectedSize);

      const existing = state.cartItems.find((item) => item.itemId === itemId);

      if (existing) {
        existing.quantity += 1; 
      } else {
        state.cartItems.push({ ...product, quantity: 1, selectedSize, itemId });
      }
      state.isCartOpen = true; 
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.itemId !== action.payload);
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart"); 
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const itemToUpdate = state.cartItems.find((item) => item.itemId === action.payload);
      if (itemToUpdate) {
        itemToUpdate.quantity += 1;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const itemToUpdate = state.cartItems.find((item) => item.itemId === action.payload);
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        itemToUpdate.quantity -= 1;
      } else if (itemToUpdate && itemToUpdate.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.itemId !== action.payload);
      }
    },

    setIsCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setIsCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
