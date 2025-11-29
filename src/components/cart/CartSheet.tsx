"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  setIsCartOpen,
} from "@/redux/cart/cartSlice";
import { selectTotalPrice, selectIsCartOpen } from "@/redux/cart/cartSelectors";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "../common/GradientButton";

export default function CartSheet() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const totalPrice = useAppSelector(selectTotalPrice);

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleIncreaseQuantity = (itemId: string) => {
    dispatch(increaseQuantity(itemId));
  };

  const handleDecreaseQuantity = (itemId: string) => {
    dispatch(decreaseQuantity(itemId));
  };

  const handleSetIsCartOpen = (open: boolean) => {
    dispatch(setIsCartOpen(open));
  };

  const handleCheckoutClick = () => {
    handleSetIsCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleSetIsCartOpen}>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart className="text-[#7C4A4A] hover:text-[#A6686A]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#A6686A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-[400px] h-full max-h-full !gap-0">
        <SheetHeader className="mb-0">
          <SheetTitle className="text-[#A6686A] text-lg">Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">Your cart is empty</p>
        ) : (
          <div className="flex flex-col px-4 h-full max-h-[calc(100%-5svh)]">
            <div className="flex-1 max-h-full overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between border-b mb-2 pb-3"
                >
                  <div className="flex items-start gap-3 w-3/4">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="rounded-md flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm leading-tight">
                        {item.title}
                      </p>

                      {item.selectedSize !== null &&
                        item.selectedSize !== undefined && (
                          <p className="text-gray-700 text-xs mt-1">
                            Size:{" "}
                            <span className="font-semibold">
                              {item.selectedSize}
                            </span>
                          </p>
                        )}

                      <p className="text-gray-500 text-sm mt-1">
                        BDT {(item.sale || item.price).toFixed(2)}
                      </p>

                      <div className="mt-2 flex items-center gap-1 rounded-full border border-[#A6686A] max-w-fit">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer h-6 w-6 text-sm"
                          onClick={() => handleDecreaseQuantity(item.itemId)}
                        >
                          -
                        </Button>
                        <span className="text-sm px-1">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-[#A6686A] text-white hover:bg-[#7C4A4A] hover:text-white cursor-pointer h-6 w-6 text-sm"
                          onClick={() => handleIncreaseQuantity(item.itemId)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end pt-1">
                    <button
                      onClick={() => handleRemoveFromCart(item.itemId)}
                      className="p-1 cursor-pointer rounded-full hover:bg-red-100 transition"
                    >
                      <Trash2 className="text-[#7C4A4A] w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500 mt-auto">
                      BDT{" "}
                      {((item.sale || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter>
              <div className="border-t py-4">
                <div className="flex justify-between font-semibold text-lg text-gray-700">
                  <span>Total:</span>
                  <span>BDT {totalPrice.toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={handleCheckoutClick}>
                  <GradientButton className="w-full mt-4 cursor-pointer">
                    Checkout
                  </GradientButton>
                </Link>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
