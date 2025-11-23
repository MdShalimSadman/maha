import { type NextRequest } from 'next/server';
import axios from 'axios';

function getBaseUrl(request: NextRequest): string {
    const url = new URL(request.url);
    return url.origin;
}

export async function POST(request: NextRequest) {
    const baseUrl = getBaseUrl(request);

    try {
        const formData = await request.formData();
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        const { tran_id, error } = data;

        // Example: Verify the transaction with payment provider
        if (tran_id) {
            try {
                const verifyResponse = await axios.post('https://api.paymentprovider.com/verify', {
                    transaction_id: tran_id
                });

                const { status } = verifyResponse.data;

                if (status === 'success') {
                    const successUrl = `${baseUrl}/payment-success?transactionId=${tran_id}`;
                    return new Response(null, {
                        status: 303,
                        headers: { 'Location': successUrl }
                    });
                }
            } catch (verificationError) {
                console.error('Verification failed:', verificationError);
            }
        }

        // If verification fails or tran_id missing, redirect to failure
        const redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id || 'unknown'}&error=${error || 'Payment failed'}`;
        return new Response(null, {
            status: 303,
            headers: { 'Location': redirectUrl }
        });

    } catch (error) {
        console.error(error);
        const errorUrl = `${baseUrl}/payment/error`;
        return new Response(null, {
            status: 303,
            headers: { 'Location': errorUrl }
        });
    }
}

export async function GET(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    const searchParams = request.nextUrl.searchParams;
    const tran_id = searchParams.get('transactionId');

    // Optionally, you could verify the transaction here with axios as well
    const redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id || 'unknown'}`;
    return new Response(null, {
        status: 303,
        headers: { 'Location': redirectUrl }
    });
}
