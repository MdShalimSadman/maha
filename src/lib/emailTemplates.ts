export const customerOrderTemplate = ({
  fullName,
  orderId,
  totalPrice,
}: {
  fullName: string;
  orderId: string;
  totalPrice: number;
}) => `
<div style="
  font-family: Arial, sans-serif;
  background: #f8f6f5;
  padding: 20px;
  color: #333;
">
  <div style="
    max-width: 600px;
    margin: auto;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0d7d7;
  ">
    <div style="
      background: #7C4A4A;
      color: white;
      padding: 18px 24px;
      font-size: 20px;
      font-weight: bold;
    ">
      Order Confirmation
    </div>

    <div style="padding: 24px;">
      <p style="font-size: 16px;">Hi <strong>${fullName}</strong>,</p>

      <p>
        Thanks for your order! We’re excited to start processing it.
      </p>

      <table style="margin-top: 15px; width: 100%;">
        <tr>
          <td style="font-weight: 600;">Order ID:</td>
          <td>${orderId}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Total:</td>
          <td>BDT ${totalPrice}</td>
        </tr>
      </table>

      <a href="https://maha-ecommerce.vercel.app/track-order" style="
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background: #7C4A4A;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      ">
        Track Order
      </a>
    </div>

    <div style="
      background: #f4eeee;
      padding: 15px;
      text-align: center;
      font-size: 13px;
      color: #7a6b6b;
    ">
      MAHAA © ${new Date().getFullYear()}
    </div>
  </div>
</div>
`;

export const adminOrderTemplate = ({
  orderId,
  fullName,
  email,
  phone,
  address,
  totalPrice,
  paymentMethod,
}: {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  paymentMethod: string;
}) => `
<div style="
  font-family: Arial, sans-serif;
  background: #f8f6f5;
  padding: 20px;
  color: #333;
">
  <div style="
    max-width: 600px;
    margin: auto;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0d7d7;
  ">
    <div style="
      background: #7C4A4A;
      color: white;
      padding: 18px 24px;
      font-size: 20px;
      font-weight: bold;
    ">
      New Order Received
    </div>

    <div style="padding: 24px;">
      <p style="font-size: 16px;">
        A new order has been placed. Details are below:
      </p>

      <table style="margin-top: 15px; width: 100%;">
        <tr><td style="font-weight: 600;">Order ID:</td><td>${orderId}</td></tr>
        <tr><td style="font-weight: 600;">Name:</td><td>${fullName}</td></tr>
        <tr><td style="font-weight: 600;">Email:</td><td>${email}</td></tr>
        <tr><td style="font-weight: 600;">Phone:</td><td>${phone}</td></tr>
        <tr><td style="font-weight: 600;">Address:</td><td>${address}</td></tr>
        <tr><td style="font-weight: 600;">Total:</td><td>BDT ${totalPrice}</td></tr>
        <tr><td style="font-weight: 600;">Payment:</td><td>${paymentMethod}</td></tr>
      </table>
    </div>

    <div style="
      background: #f4eeee;
      padding: 15px;
      text-align: center;
      font-size: 13px;
      color: #7a6b6b;
    ">
     © 2025 MAHAA ALL RIGHTS RESERVED
    </div>
  </div>
</div>
`;
