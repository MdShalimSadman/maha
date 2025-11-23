"use client";

import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import GradientButton from "@/components/common/GradientButton";

import CheckoutPersonalInfo from "./CheckoutPersonalInfo";
import CheckoutAddressInfo from "./CheckoutAddressInfo";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import { ICheckoutFormData } from "@/types/checkout";
import { toast } from "sonner";

const CheckoutIndex = () => {
  const { cartItems, getTotalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICheckoutFormData>({
    defaultValues: { paymentMethod: "ssl_commerz" },
  });

  const saveOrderToFirestore = async (
    data: ICheckoutFormData
  ): Promise<string | null> => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: cartItems.map((item) => ({
          _id: item._id,
          itemId: item.itemId,
          title: item.title,
          price: item.sale || item.price,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
        orderDate: serverTimestamp(),
        status: "Pending",
        payment_status: "Awaiting Payment",
      };
      const docRef = await addDoc(collection(db, "orders"), orderData);
      return docRef.id;
    } catch (e) {
      console.error("Firestore Save Error:", e);
      toast.error("Failed to save order. Please try again.");
      return null;
    }
  };

  const handlePaymentRedirect = async (
    orderId: string,
    data: ICheckoutFormData
  ) => {
    const paymentDetails = {
      amount: getTotalPrice(),
      customer_name: data.fullName,
      customer_email: data.email,
      order_id: orderId,
      payment_status: "pending",
      success_url: `${window.location.origin}/payment-success`,
      fail_url: `${window.location.origin}/checkout`,
    };

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error" }));
        toast.error(
          "Payment initiation failed: " +
            (errorData.message || response.statusText)
        );
        return;
      }

      const result = await response.json();

      if (result.status === "success" && result.GatewayPageURL) {
        window.location.href = result.GatewayPageURL;
      } else {
        toast.error(
          "Payment initiation failed: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred during payment.");
    }
  };

  const onSubmit = async (data: ICheckoutFormData) => {
    setIsSubmitting(true);
    const orderId = await saveOrderToFirestore(data);
    const totalPrice = getTotalPrice();

    if (!orderId) {
      setIsSubmitting(false);
      return;
    }

    await handlePaymentRedirect(orderId, data);

    setIsSubmitting(false);
  };

  if (cartItems.length === 0) {
    return (
      <p className="text-center mt-10 text-lg p-8 rounded-xl bg-white max-w-lg mx-auto">
        Your cart is empty. <br /> Please add items before checking out.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 md:gap-6 lf:gap-10 xl:gap-12 rounded-xl mx-auto max-w-6xl p-4 md:p-6 xl:p-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <CheckoutPersonalInfo register={register} errors={errors} />
        <CheckoutAddressInfo register={register} errors={errors} />
        <CheckoutPaymentMethods register={register} />
        <GradientButton
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Redirecting to Payment..."
            : "Confirm & Proceed to Payment"}
        </GradientButton>
      </form>
      <div className="flex-1 h-full rounded-lg">
        <CheckoutOrderSummary
          cartItems={cartItems}
          getTotalPrice={getTotalPrice}
        />
      </div>
    </div>
  );
};

export default CheckoutIndex;
