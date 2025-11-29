"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import GradientButton from "../common/GradientButton";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cart/cartSlice";

interface AddToCartButtonProps {
  product: Product;
  selectedSize: number | null;
  disabled?: boolean;
}

const getCartItemId = (
  product: Product,
  selectedSize: number | null
): string => {
  const sizeKey =
    selectedSize !== null && selectedSize !== undefined
      ? selectedSize
      : "NOSIZE";
  return `${product._id}-${sizeKey}`;
};

export default function AddToCartButton({
  product,
  selectedSize,
  disabled = false,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.cartItems);

  const itemId = getCartItemId(product, selectedSize);

  const cartItem = cartItems.find((item) => item.itemId === itemId);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="flex flex-row gap-4">
      {quantity > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-[#A6686A]">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
            onClick={() => dispatch(decreaseQuantity(itemId))}
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer"
            onClick={() => dispatch(increaseQuantity(itemId))}
          >
            +
          </Button>
        </div>
      )}
      <GradientButton
        className="cursor-pointer"
        onClick={() => dispatch(addToCart({ product, selectedSize }))}
        disabled={disabled}
      >
        Add to Cart
      </GradientButton>
    </div>
  );
}
