import { NextResponse, type NextRequest } from "next/server";

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === "production";

interface PaymentRequestBody {
  amount: number;
  customer_name: string;
  customer_email: string;
  order_id: string;
}

export async function POST(request: NextRequest) {
  if (!store_id || !store_passwd) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  let bodyData: PaymentRequestBody;
  try {
    bodyData = (await request.json()) as PaymentRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { amount, customer_name, customer_email, order_id } = bodyData;

  if (!amount || !customer_name || !customer_email || !order_id) {
    return NextResponse.json(
      { message: "Missing required fields (amount, name, email, or order_id)" },
      { status: 400 }
    );
  }

  const tran_id = `TRN_${Date.now()}`;

  const protocol =
    request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "";
  const base_url = `${protocol}://${host}`;

  // const sslczUrl = is_live
  //   ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
  //   : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";


      const sslczUrl = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";


  // All values must be string for URLSearchParams
  const paymentData: Record<string, string> = {
    store_id,
    store_passwd,
    total_amount: String(amount),
    currency: "BDT",
    tran_id,
    value_a: order_id,
    success_url: `${base_url}/api/payment/success`,
    fail_url: `${base_url}/api/payment/fail`,
    cancel_url: `${base_url}/checkout`,
    ipn_url: `${base_url}/api/payment/ipn`,
    cus_name: customer_name,
    cus_email: customer_email,
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    shipping_method: "NO",
    product_name: "E-commerce Order",
    product_category: "Merchandise",
    product_profile: "general",
  };

  try {
    const response = await fetch(sslczUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(paymentData).toString(),
    });

    interface SSLResponse {
      status: string;
      GatewayPageURL?: string;
      [key: string]: unknown;
    }

    const apiResponse = (await response.json()) as SSLResponse;

    if (apiResponse.status === "SUCCESS" && apiResponse.GatewayPageURL) {
      return NextResponse.json({
        GatewayPageURL: apiResponse.GatewayPageURL,
        status: "success",
      });
    }

    return NextResponse.json(
      {
        message: "Payment initiation failed",
        details: apiResponse,
      },
      { status: 400 }
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to initiate payment",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
