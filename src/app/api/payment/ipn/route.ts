import { NextResponse } from 'next/server';

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = false;

interface IPNData {
  val_id: string;
  tran_id: string;
  status: string;
  [key: string]: string;
}

interface SSLCommerzValidationResponse {
  status: 'VALID' | 'VALIDATED' | 'FAILED' | string;
  tran_id: string;
  val_id: string;
  [key: string]: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data: IPNData = {
      val_id: '',
      tran_id: '',
      status: ''
    };
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('IPN Received:', data);

    const { val_id, tran_id } = data;

    if (!val_id || !tran_id) {
      return NextResponse.json(
        { message: 'Missing val_id or tran_id' },
        { status: 400 }
      );
    }

    // Validate with SSLCommerz
    const validationUrl = is_live
      ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
      : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

    const validationResponse = await fetch(validationUrl);
    const validationData: SSLCommerzValidationResponse = await validationResponse.json();

    if (validationData.status === 'VALID' || validationData.status === 'VALIDATED') {
      console.log('IPN Validated Successfully:', tran_id);
      return NextResponse.json(
        { message: 'IPN processed successfully' },
        { status: 200 }
      );
    } else {
      console.error('IPN Validation Failed:', validationData);
      return NextResponse.json(
        { message: 'IPN validation failed' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('IPN Handler Error:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { message: 'IPN processing error', error: message },
      { status: 500 }
    );
  }
}
