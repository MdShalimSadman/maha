"use client";

import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { ICheckoutFormData } from "@/types/checkout";



interface ICheckoutPaymentMethodsProps {
  register: UseFormRegister<ICheckoutFormData>;
};

const CheckoutPaymentMethods: FC<ICheckoutPaymentMethodsProps> = ({ register }) => {
  return (
    <div>
      <Label className="text-base font-medium text-[#5e5a57] mb-2">
        Payment Method
      </Label>

      <RadioGroup defaultValue="ssl_commerz">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="ssl_commerz"
              id="ssl_commerz"
              {...register("paymentMethod")}
            />
            <Image src="/images/payment/sslcommerz.png" width={50} height={50} alt="cash" />
            <Label htmlFor="cash_on_delivery">Pay with SSL Commerz</Label>
          </div>

        </div>
      </RadioGroup>
    </div>
  );
};

export default CheckoutPaymentMethods;
