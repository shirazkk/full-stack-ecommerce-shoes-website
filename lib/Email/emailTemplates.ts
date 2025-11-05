import { Order } from "@/types";

export function orderSuccessTemplate(order: Order) {
  return `
  <h2>✅ Your order has been placed successfully!</h2>
  <p>Order ID: <b>${order.id}</b></p>
  <p>Total: <b>$${order.total.toFixed(2)}</b></p>
  <p>Status: <b>${order.status}</b></p>
  <h3>Items:</h3>
  <ul>
    ${order.order_items!.map(
    (item) =>
      `<li>${item.product} - ${item.quantity} × $${item.price} × {${item.color} × ${item.size}}</li>`
  )
      .join('')}
  </ul>
  <p>Tracking ID: <b>${order.order_number ?? 'Not assigned yet'}</b></p>
  <p>We’ll notify you when your order ships.</p>
  `;
}

export function paymentFailedTemplate(order: Order) {
  return `
  <h2>⚠️ Payment Failed for Your Order</h2>
  <p>Order ID: <b>${order.id}</b></p>
   <p>Total: <b>$${order.total.toFixed(2)}</b></p>
  <p>Status: <b>${order.status}</b></p>
  <h3>Items:</h3>
  <ul>
    ${order.order_items!.map(
    (item) =>
      `<li>${item.product} - ${item.quantity} × $${item.price} × {${item.color} × ${item.size}}</li>`
  )
      .join('')}
  </ul>
  <p>Please retry your payment or contact support.</p>
  `;
}

export function orderCancelledTemplate(order: any) {
  return `
  <h2>❌ Your order has been cancelled.</h2>
  <p>Order ID: <b>${order.id}</b></p>
  <p>We’ve restocked your items and refunded if applicable.</p>
  `;
}
