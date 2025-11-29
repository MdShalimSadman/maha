"use client";

import { Provider } from "react-redux";
import { store, RootState } from "@/redux/store";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

function CartStateSyncer() {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return null;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CartStateSyncer />
      {children}
    </Provider>
  );
}