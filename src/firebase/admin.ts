import * as admin from 'firebase-admin'; 
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore'; 
import { getAuth } from 'firebase-admin/auth'; 
import { OrderDetails } from '@/types/order';
import { ServiceAccount } from 'firebase-admin';

interface PaymentValidationData {
  [key: string]: string | number | boolean | null | object;
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  try {
    initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization FAILED:", error);
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

const updatePaymentStatus = async (
  orderId: string,
  tran_id: string,
  validationData: PaymentValidationData
) => {
  try {
    const orderRef = adminDb.collection('orders').doc(orderId);

    await orderRef.update({
      payment_status: 'Payment Successful',
      transactionId: tran_id,
      paymentDetails: validationData,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Order ${orderId} status updated to SUCCESS.`);
  } catch (error) {
    console.error(`Failed to update order ${orderId} in Firestore:`, error);
    throw new Error('Database update failed');
  }
};

async function fetchOrderDetails(orderId: string): Promise<OrderDetails> {
  const orderDoc = await adminDb.collection('orders').doc(orderId).get();

  if (!orderDoc.exists) {
    throw new Error(`Order with ID ${orderId} not found.`);
  }

  const data = orderDoc.data();

  if (!data) {
    throw new Error(`Order data for ID ${orderId} is empty.`);
  }

  return {
    email: data.email,
    fullName: data.fullName,
    totalPrice: data.totalPrice,
    address: data.address,
    phone: data.phone,
    paymentMethod: data.paymentMethod,
  };
}

export { adminDb, adminAuth, updatePaymentStatus, fetchOrderDetails };
