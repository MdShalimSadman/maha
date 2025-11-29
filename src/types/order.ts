type OrderItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  paymentMethod: string; 
  items: OrderItem[];
  subtotal: number;
  shipping?: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  userId?: string | null;          
  createdAt: string;    
  payment_status:string;            
}

export interface OrderDetails {
    email: string;
    fullName: string;
    totalPrice: number;
    address: string;
    phone: string;
    paymentMethod: string;
}