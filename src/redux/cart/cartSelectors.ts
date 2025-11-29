import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectCartItems = (state: RootState) => state.cart.cartItems;

export const selectTotalPrice = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce((total, item) => {
      const price = item.sale || item.price;
      return total + price * item.quantity;
    }, 0)
);

export const selectIsCartOpen = (state: RootState) => state.cart.isCartOpen;